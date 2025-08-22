import React, { type MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Button } from "@heroui/react";
import { useTokenStore } from "../hooks/useTokenStore";
import type { Usuario } from "../interfaces/Usuario";

export type Foto = {
    id: number;
    key?: string;
    url: string;
    ordem?: number;
};

interface Props {
    nome_paciente?: string;
    procedimento_nome: string;
    dt_realizacao?: string;
    status: string;
    fotos: Foto[];
    num_retorno?: number;
    usuario_id_tipo?: number;
    onDeleteFoto?: (fotoId: number) => Promise<void> | void;
    onReplaceFoto?: (fotoId: number, file: File) => Promise<void> | void;
    onRequestFotos?: () => Promise<Foto[]>;
    onclick?: MouseEventHandler<HTMLParagraphElement>;
}

function formatDateOnly(dateStr?: string) {
    if (!dateStr) return "N/A";
    const parts = dateStr.split("-");
    if (parts.length < 3) return dateStr;
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
}

export function ProcedimentoCard({
    nome_paciente,
    procedimento_nome,
    dt_realizacao,
    num_retorno,
    fotos,
    status,
    usuario_id_tipo,
    onDeleteFoto,
    onReplaceFoto,
    onRequestFotos,
    onclick,
}: Props) {
    const statusInfo: Record<string, { label: string; color: string }> = {
        "Aguardando procedimento": { label: "Aguardando", color: "bg-blue-500" },
        Finalizado: { label: "Finalizado", color: "bg-green-500" },
        Retorno: { label: "Retorno", color: "bg-yellow-500" },
    };
    const { label, color } = statusInfo[status] || { label: status, color: "bg-gray-500" };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const gridCols =
        usuario_id_tipo === 1 ? "sm:grid-cols-[1fr_2fr_1fr_1fr_auto]" : "sm:grid-cols-[2fr_1fr_1fr_1fr_auto]";

    const sortedFromProps = useMemo(() => {
        if (!Array.isArray(fotos)) return [] as Foto[];
        return fotos.slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
    }, [fotos]);

    const [localFotos, setLocalFotos] = useState<Foto[]>(sortedFromProps);
    useEffect(() => {
        setLocalFotos(sortedFromProps);
    }, [sortedFromProps]);

    const [index, setIndex] = useState(0);
    const current = localFotos[index];

    const { user, token } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    useEffect(() => {
        if (!user?.id) return;
        fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(r => r.json())
            .then((data: Usuario) => setUsuario(data))
            .catch(console.error);
    }, [token, user?.id]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [replaceTargetId, setReplaceTargetId] = useState<number | null>(null);
    const [actionLocked, setActionLocked] = useState(false);

    const goPrev = () => setIndex((i) => (localFotos.length ? (i - 1 + localFotos.length) % localFotos.length : 0));
    const goNext = () => setIndex((i) => (localFotos.length ? (i + 1) % localFotos.length : 0));

    async function handleDelete(fotoId: number) {
        if (!onDeleteFoto) return;
        if (!confirm("Deseja remover esta foto?")) return;
        try {
            setActionLocked(true);
            await onDeleteFoto(fotoId);
            if (onRequestFotos) {
                const fresh = await onRequestFotos();
                setLocalFotos((fresh ?? []).slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)));
                setIndex(0);
            }
        } catch (err) {
            console.error("delete foto", err);
        } finally {
            setActionLocked(false);
        }
    }

    function triggerReplace(fotoId: number) {
        if (!onReplaceFoto) return;
        setReplaceTargetId(fotoId);
        fileInputRef.current?.click();
    }

    async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || replaceTargetId == null) {
            e.currentTarget.value = "";
            setReplaceTargetId(null);
            return;
        }
        try {
            setActionLocked(true);
            await onReplaceFoto?.(replaceTargetId, file);
            if (onRequestFotos) {
                const fresh = await onRequestFotos();
                setLocalFotos((fresh ?? []).slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)));
                setIndex(0);
            }
        } catch (err) {
            console.error("replace foto", err);
        } finally {
            setActionLocked(false);
            e.currentTarget.value = "";
            setReplaceTargetId(null);
        }
    }
    async function openAndMaybeRefresh() {
        if (onRequestFotos) {
            try {
                const fresh = await onRequestFotos();
                setLocalFotos((fresh ?? []).slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)));
                setIndex(0);
            } catch (err) {
                console.error("onRequestFotos error", err);
            }
        }
        onOpen();
    }

    useEffect(() => {
        if (index >= localFotos.length && localFotos.length > 0) setIndex(0);
    }, [localFotos, index]);

    return (
        <>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

            <div
                className={`grid grid-cols-1 ${gridCols} gap-4 w-full text-white border border-[#9B7F67] items-center bg-[#9B7F67] p-3 rounded-md hover:bg-[#E3DCD4] hover:text-black transition-colors duration-150`}
            >
                {usuario_id_tipo === 1 && nome_paciente && <p className="truncate">Nome: {nome_paciente}</p>}
                <p className="truncate">Procedimento: {procedimento_nome}</p>

                <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm whitespace-nowrap">{label}</span>
                </div>

                <p className="truncate whitespace-nowrap">Data: {formatDateOnly(dt_realizacao)}</p>
                <p className="truncate">N° retorno: {num_retorno == null || num_retorno === 0 ? "N/A" : num_retorno}</p>

                <div
                    onClick={() => { setIndex(0); void openAndMaybeRefresh(); }}
                    className="flex items-center gap-2 cursor-pointer"
                    role="button"
                    aria-label={`Abrir galeria de fotos (${localFotos.length})`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white hover:text-gray-800">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l1-2h12l1 2h2a1 1 0 011 1v12a1 1 0 01-1 1H3
                         a1 1 0 01-1-1V8a1 1 0 011-1z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>

                    <span className="text-sm truncate">Fotos ({localFotos.length})</span>
                </div>

                {usuario_id_tipo === 1 && onclick && (
                    <p onClick={onclick} className="underline cursor-pointer text-right sm:col-end-7">
                        Atualizar
                    </p>
                )}
            </div>

            <Modal className="bg-[#e5ded8]" isOpen={isOpen} size={"3xl"} onClose={onClose}>
                <ModalContent className="text-black max-h-[80vh] overflow-y-auto">
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Galeria de fotos</ModalHeader>
                            <ModalBody className="flex h-full flex-col items-center p-2">
                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="w-full flex items-center justify-center gap-4">
                                        <Button type="button" onClick={goPrev} className="px-3 py-2">◀</Button>
                                        <div className="w-full flex items-center justify-center overflow-hidden rounded-md bg-black">
                                            {current ? (
                                                <img
                                                    src={current.url}
                                                    alt={`foto-${current.id}`}
                                                    className="w-full h-auto max-h-[80vh] object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-white">Sem fotos</div>
                                            )}
                                        </div>
                                        <Button type="button" onClick={goNext} className="px-3 py-2">▶</Button>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        {localFotos.length > 0 ? `Foto ${index + 1} de ${localFotos.length}` : "Nenhuma foto disponível"}
                                    </div>

                                    <div className="w-full overflow-x-auto py-2">
                                        <div className="flex gap-2 items-center">
                                            {localFotos.map((f, i) => (
                                                <div key={f.id ?? i} className="flex flex-col items-center gap-1">
                                                    <button
                                                        onClick={() => setIndex(i)}
                                                        className={`w-24 h-16 rounded-md overflow-hidden border ${i === index ? "border-2 border-[#7F634B]" : "border-transparent"}`}
                                                        aria-label={`Selecionar foto ${i + 1}`}
                                                    >
                                                        <img src={f.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                                    </button>

                                                    {
                                                        usuario?.id_tipo_usuario === 1 ?
                                                            <div className="flex gap-1 mt-1">
                                                                <Button size="sm" disabled={!onReplaceFoto || actionLocked} onClick={() => triggerReplace(f.id)}>
                                                                    Substituir
                                                                </Button>
                                                                <Button size="sm" disabled={!onDeleteFoto || actionLocked} onClick={() => handleDelete(f.id)}>
                                                                    Excluir
                                                                </Button>
                                                            </div>
                                                            : null
                                                    }

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProcedimentoCard;

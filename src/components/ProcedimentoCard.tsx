import React, { type MouseEventHandler, useMemo, useRef, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Button } from "@heroui/react";

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
  fotos: Foto[]; // agora obrigatório (ou ao menos passar [] vazio)
  num_retorno?: number;
  usuario_id_tipo?: number;
  // optional callbacks — se você implementar endpoints, passe as funções aqui
  onDeleteFoto?: (fotoId: number) => Promise<void> | void;
  onReplaceFoto?: (fotoId: number, file: File) => Promise<void> | void;
  onclick?: MouseEventHandler<HTMLParagraphElement>; // manter 'Atualizar'
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

  // ordena fotos por 'ordem' se tiver
  const normalizedFotos = useMemo(() => {
    if (!Array.isArray(fotos)) return [] as Foto[];
    return fotos.slice().sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  }, [fotos]);

  const [index, setIndex] = useState(0);
  const current = normalizedFotos[index];

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<number | null>(null);
  const [actionLocked, setActionLocked] = useState(false);

  const goPrev = () => setIndex((i) => (normalizedFotos.length ? (i - 1 + normalizedFotos.length) % normalizedFotos.length : 0));
  const goNext = () => setIndex((i) => (normalizedFotos.length ? (i + 1) % normalizedFotos.length : 0));

  async function handleDelete(fotoId: number) {
    if (!onDeleteFoto) return;
    if (!confirm("Deseja remover esta foto?")) return;
    try {
      setActionLocked(true);
      await onDeleteFoto(fotoId);
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
    } catch (err) {
      console.error("replace foto", err);
    } finally {
      setActionLocked(false);
      e.currentTarget.value = "";
      setReplaceTargetId(null);
    }
  }

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

        <div onClick={() => { setIndex(0); onOpen(); }} className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-black overflow-hidden rounded-sm">
            {normalizedFotos[0] ? (
              <img src={normalizedFotos[0].url} alt="thumb" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-700" />
            )}
          </div>
          <span className="text-sm truncate">Fotos ({normalizedFotos.length})</span>
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
                    <div className="w-full max-w-[680px] max-h-[480px] bg-black flex items-center justify-center overflow-hidden rounded-md">
                      {current ? (
                        <img src={current.url} alt={`foto-${current.id}`} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-white">Sem fotos</div>
                      )}
                    </div>
                    <Button type="button" onClick={goNext} className="px-3 py-2">▶</Button>
                  </div>

                  <div className="text-sm text-gray-700">
                    {normalizedFotos.length > 0 ? `Foto ${index + 1} de ${normalizedFotos.length}` : "Nenhuma foto disponível"}
                  </div>

                  <div className="w-full overflow-x-auto py-2">
                    <div className="flex gap-2 items-center">
                      {normalizedFotos.map((f, i) => (
                        <div key={f.id ?? i} className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => setIndex(i)}
                            className={`w-24 h-16 rounded-md overflow-hidden border ${i === index ? "border-2 border-[#7F634B]" : "border-transparent"}`}
                            aria-label={`Selecionar foto ${i + 1}`}
                          >
                            <img src={f.url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                          </button>

                          <div className="flex gap-1 mt-1">
                            <Button size="sm" disabled={!onReplaceFoto || actionLocked} onClick={() => triggerReplace(f.id)}>
                              Substituir
                            </Button>
                            <Button size="sm" disabled={!onDeleteFoto || actionLocked} onClick={() => handleDelete(f.id)}>
                              Excluir
                            </Button>
                          </div>
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

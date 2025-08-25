import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
  Form as HForm,
} from '@heroui/react';
import { DateInput } from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { ProcedimentoCard } from '../components/ProcedimentoCard';
import type { Procedimento } from '../interfaces/Procedimento';
import type { Usuario } from '../interfaces/Usuario';
import { Controller, FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { useSearchParams } from 'react-router';

type RetornoForm = {
  dbId?: number; // id no banco (se existir)
  num_retorno?: number | null;
  descricao?: string;
  dt_retorno?: string;
};

export type FormValues = Omit<Procedimento, 'id'> & {
  retornos?: RetornoForm[];
};

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg aria-hidden="true" fill="none" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
    <path
      d="M7.75 2.5a.75.75 0 0 0-1.5 0V4H4.75A2.75 2.75 0 0 0 2 6.75v11.5A2.75 2.75 0 0 0 4.75 21h14.5A2.75 2.75 0 0 0 22 18.25V6.75A2.75 2.75 0 0 0 19.25 4H17V2.5a.75.75 0 0 0-1.5 0V4H8.5V2.5zM4.75 5.5h14.5c.69 0 1.25.56 1.25 1.25V9H3.5V6.75c0-.69.56-1.25 1.25-1.25zM3.5 10h17v8.25c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25V10z"
      fill="currentColor"
    />
  </svg>
);

type Foto = {
  id: number;
  key: string;
  url: string;
  ordem: number;
};

function ListagemProcedimentoPage() {
  const { token, user } = useTokenStore();
  const [searchParams] = useSearchParams();
  const usuarioId = searchParams.get('usuario_id');

  const fileInputRef = useRef<HTMLInputElement>(null); // para upload múltiplo
  const fileReplaceRef = useRef<HTMLInputElement | null>(null); // para substituir única foto
  const [uploading, setUploading] = useState<boolean>(false);

  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();
  const [procedimento, setProcedimento] = useState<Procedimento & { fotos?: Foto[] }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [idProcedimento, setIdProcedimento] = useState<number | undefined>();
  const [replaceTargetId, setReplaceTargetId] = useState<number | null>(null);

  // ---- auth headers helper (evita passar string | undefined) ----
  const authHeaders = token ? ({ Authorization: `Bearer ${token}` } as Record<string, string>) : {};

  const formik = useFormik({
    initialValues: {
      parametro: usuario?.id_tipo_usuario === 1 ? 'nome' : 'status',
      valorBusca: '',
    },
    enableReinitialize: true,
    onSubmit: async ({ parametro, valorBusca }) => {
      const url = new URL(`${import.meta.env.VITE_API_URL}/procedimentos`);
      if (usuarioId) url.searchParams.set('usuario_id', usuarioId);
      if (valorBusca) url.searchParams.set(parametro, valorBusca);

      const res = await fetch(url.toString(), {
        headers: { ...authHeaders },
      });
      const data: Procedimento[] = await res.json();

      const withFotos = await Promise.all(
        data.map(async (p) => {
          const fotos = await fetchFotoUrlsAll(p.id);
          // attach fotos array to procedimento object
          return { ...p, fotos };
        })
      );
      setProcedimentos(withFotos);
    },
  });

  async function fetchFotoUrlsAll(idProcedimento: number): Promise<Foto[]> {
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}/url`,
        { headers: { ...authHeaders } }
      );
      const body = await resp.json();
      // backend returns { fotos: [...] }
      return body?.fotos ?? [];
    } catch (err) {
      console.error('fetchFotoUrlsAll error', err);
      return [];
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders },
    })
      .then((res) => res.json())
      .then(setUsuario)
      .catch(console.error);
  }, [token, user?.id]); // authHeaders depends on token, but token is in deps

  const fetchProcedimentos = async () => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/procedimentos`);
    if (usuarioId) url.searchParams.set('usuario_id', usuarioId);
    const res = await fetch(url.toString(), {
      headers: { ...authHeaders },
    });
    const data: Procedimento[] = await res.json();
    const withFotos = await Promise.all(
      data.map(async (p) => ({ ...p, fotos: await fetchFotoUrlsAll(p.id) }))
    );
    setProcedimentos(withFotos);
  };

  useEffect(() => {
    fetchProcedimentos();
  }, [token]);

  const methods = useForm<FormValues>({
    defaultValues: {
      dt_realizacao: '',
      dt_ultimo_retorno: '',
      obs_procedimento: '',
      num_retorno: 0,
      status_retorno: '',
      retornos: [], // adiciona retornos
    },
  });
  const { reset, handleSubmit, control, getValues, formState: { errors } } = methods;

  // fieldArray para 'retornos'
  const {
    fields: retornoFields,
    append: appendRetorno,
    remove: removeRetornoField,
    replace: replaceRetornos,
  } = useFieldArray({
    control,
    name: 'retornos',
  });

  useEffect(() => {
    if (!idProcedimento) return;
    (async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}`,
        { headers: { ...authHeaders } }
      );
      const data: Procedimento = await res.json();

      const fotos = await fetchFotoUrlsAll(data.id);

      setProcedimento({ ...data, fotos });
      reset({
        dt_realizacao: data.dt_realizacao || '',
        dt_ultimo_retorno: data.dt_ultimo_retorno || '',
        obs_procedimento: data.obs_procedimento || '',
        num_retorno: data.num_retorno ?? 0,
        status_retorno: data.status_retorno || '',
        retornos: [], // será substituído abaixo
      });
      onOpen();

      // carregar retornos/versionamento do backend
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}/retornos`,
          { headers: { 'Content-Type': 'application/json', ...authHeaders } }
        );
        if (!resp.ok) {
          console.warn('Não foi possível buscar versões:', resp.status);
          replaceRetornos([]);
          return;
        }
        const dataRet = await resp.json(); // espera array de versões
        const normalized = (dataRet || []).map((r: any) => ({
          dbId: r.id,
          num_retorno: r.num_retorno ?? 0,
          descricao: r.descricao ?? '',
          dt_retorno: r.dt_retorno ?? '',
        }));
        replaceRetornos(normalized);
      } catch (err) {
        console.error('erro ao buscar retornos', err);
        replaceRetornos([]);
      }
    })().catch(console.error);
  }, [idProcedimento, token, reset, onOpen]);

  const onEditSubmit = async (values: FormValues) => {
    if (!idProcedimento) return;

    // separa retornos do restante do procedimento
    const { retornos = [], ...procValues } = values as any;

    // atualiza procedimento
    const res = await fetch(`${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(procValues),
    });

    if (!res.ok) {
      console.error('Falha ao atualizar procedimento', res.status);
      return;
    }

    // processar retornos: novos => POST, existentes (dbId) => PUT
    await Promise.all(
      (retornos || []).map(async (r: RetornoForm) => {
        try {
          if (r.dbId) {
            // atualizar existente - endpoint presumido
            const up = await fetch(`${import.meta.env.VITE_API_URL}/procedimento/retornos/${r.dbId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', ...authHeaders },
              body: JSON.stringify({
                num_retorno: r.num_retorno,
                descricao: r.descricao,
                dt_retorno: r.dt_retorno,
              }),
            });
            if (!up.ok) console.warn('PUT retorno falhou', up.status);
          } else {
            // novo retorno -> POST para /procedimento/:idProcedimento/retornos
            const post = await fetch(`${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}/retornos`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...authHeaders },
              body: JSON.stringify({
                num_retorno: r.num_retorno,
                descricao: r.descricao,
                dt_retorno: r.dt_retorno,
              }),
            });
            if (!post.ok) console.warn('POST retorno falhou', post.status);
          }
        } catch (err) {
          console.error('erro ao salvar retorno', err);
        }
      })
    );

    // fechar modal e atualizar listagem
    onClose();
    fetchProcedimentos();
  };

  // now apiReplaceFoto uses token from closure via authHeaders
  async function apiReplaceFoto(procId: number, fotoId: number, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/procedimento/${procId}/foto/${fotoId}/replace`, {
      method: 'PUT',
      headers: { ...authHeaders }, // multer/formdata: no Content-Type
      body: fd,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Falha ao substituir foto');
    }
    return res.json();
  }

  // Upload múltiplo (manter)
  const handleFileChange = async () => {
    const files = fileInputRef.current?.files;
    if (!files || !files.length || !idProcedimento) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files', f));

    try {
      setUploading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}/upload`,
        { method: 'POST', headers: { ...authHeaders }, body: formData }
      );

      const body = await res.json();
      if (!res.ok) {
        console.error('Upload falhou:', res.status, body);
      } else {
        // backend returns fotosCriadas array, but we will simply refresh the list
        const fotos = await fetchFotoUrlsAll(idProcedimento);
        setProcedimento((prev) => (prev ? { ...prev, fotos } : prev));
        fetchProcedimentos();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFoto = async (fotoId: number,) => {
    if (!confirm('Remover essa foto?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/procedimento/foto/${fotoId}`, {
        method: 'DELETE',
        headers: { ...authHeaders },
      });
      if (!res.ok) console.warn('delete foto response', res.status);

      if (idProcedimento) {
        const fotos = await fetchFotoUrlsAll(idProcedimento);
        setProcedimento((prev) => (prev ? { ...prev, fotos } : prev));
        fetchProcedimentos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----- NOVO: substituição (trigger + handler) -----
  function triggerReplace(fotoId: number) {
    setReplaceTargetId(fotoId);
    fileReplaceRef.current?.click();
  }

  async function handleReplaceFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const targetId = replaceTargetId;
    e.currentTarget.value = "";

    if (!file || !targetId || !idProcedimento) {
      setReplaceTargetId(null);
      return;
    }

    try {
      setUploading(true);
      await apiReplaceFoto(idProcedimento, targetId, file);

      // Atualiza fotos do procedimento com dados do servidor (mais seguro)
      const fotos = await fetchFotoUrlsAll(idProcedimento);
      setProcedimento((prev) => (prev ? { ...prev, fotos } : prev));
      fetchProcedimentos();
    } catch (err) {
      console.error('Erro ao substituir foto', err);
      alert('Falha ao substituir foto. Tente novamente.');
    } finally {
      setUploading(false);
      setReplaceTargetId(null);
    }
  }
  // ----- fim substituição -----

  return (
    <div className="flex flex-col gap-4 items-center w-screen">
      <Form className="w-[95%] sm:w-[80%] flex flex-col gap-4 bg-[rgba(155,127,103,0.26)] p-4 rounded-md" onSubmit={formik.handleSubmit}>
        <div className="flex flex-wrap gap-4 w-full justify-start items-center">
          <Select
            className="max-w-xs"
            label="Pesquisar por"
            selectedKeys={new Set([formik.values.parametro])}
            onSelectionChange={(keys) => {
              const sel = Array.from(keys)[0] as 'nome' | 'status' | 'dt_realizacao';
              formik.setFieldValue('parametro', sel);
              formik.setFieldValue('valorBusca', '');
            }}
          >
            {usuario?.id_tipo_usuario === 1 ? (
              <SelectItem className='text-black' key="nome">Nome</SelectItem>
            ) : null}
            <SelectItem className='text-black' key="status">Status</SelectItem>
            <SelectItem className='text-black' key="dt_realizacao">Data de Retorno</SelectItem>
          </Select>

          {formik.values.parametro === 'nome' && usuario?.id_tipo_usuario === 1 && (
            <Input
              className="sm:flex-1 sm:w-[80%] sm:max-w-none max-w-xs"
              label="Nome do paciente"
              placeholder="Digite o nome"
              {...formik.getFieldProps('valorBusca')}
            />
          )}
          {formik.values.parametro === 'status' && (
            <Select
              className="max-w-xs"
              label="Status"
              selectedKeys={new Set([formik.values.valorBusca])}
              onSelectionChange={(keys) => formik.setFieldValue('valorBusca', Array.from(keys)[0] ?? '')}
            >
              <SelectItem className='text-black' key="aguardando procedimento">Aguardando</SelectItem>
              <SelectItem className='text-black' key="retorno">Retorno</SelectItem>
              <SelectItem className='text-black' key="finalizado">Finalizado</SelectItem>
            </Select>
          )}
          {formik.values.parametro === 'dt_realizacao' && (
            <DateInput
              className="max-w-xs"
              label="Data de Retorno"
              value={formik.values.valorBusca ? parseDate(formik.values.valorBusca) : null}
              onChange={(d) => formik.setFieldValue('valorBusca', d?.toString() ?? '')}
            />
          )}

          <Button size="lg" type="submit" className="text-white bg-[#7F634B]">
            Buscar
          </Button>
        </div>
      </Form>

      <div className="w-[90%] flex flex-col gap-5 p-4 bg-[rgba(155,127,103,0.26)] rounded-sm">
        <div className="flex flex-col gap-5 p-5 justify-center bg-[rgba(155,127,103,0.26)] w-full">
          {procedimentos.length === 0 ? (
            <div className='flex flex-col w-full justify-center items-center gap-5'>
              <h2 className="text-center text-3xl text-[#75614e]">Parece que você ainda não tem procedimentos</h2>
              <p className='text-lg text-[#75614e]'>Faça seu orçamento com a doutora primeiro!</p>
            </div>
          ) : (
            procedimentos
              .filter((p) => p.orcamento?.usuario)
              .map((p, i) => (
                <ProcedimentoCard
                  key={i}
                  nome_paciente={p.orcamento.usuario.nome}
                  procedimento_nome={p.nome_procedimento}
                  dt_realizacao={p.dt_realizacao}
                  status={p.status_retorno}
                  num_retorno={p.num_retorno}
                  usuario_id_tipo={usuario?.id_tipo_usuario ?? 0}
                  onclick={() => {
                    if (usuario?.id_tipo_usuario === 2) return;
                    setIdProcedimento(p.id);
                    onOpen();
                  }}
                  fotos={p.fotos ?? []}
                  onRequestFotos={async () => {
                    const fresh = await fetchFotoUrlsAll(p.id);
                    return fresh;
                  }}
                />
              ))
          )}
        </div>
      </div>

      {/* input para upload múltiplo */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" multiple onChange={handleFileChange} />
      {/* input para substituir UMA foto (oculto) */}
      <input ref={fileReplaceRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFileChange} />

      <Modal className='bg-[#e5ded8]' isOpen={isOpen} size={'3xl'} onClose={onClose}>
        <ModalContent className='text-black max-h-[80vh] overflow-y-auto'>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edição de procedimento</ModalHeader>
              <ModalBody className="flex h-full flex-col items-center p-2">
                <FormProvider {...methods}>
                  <HForm onSubmit={handleSubmit(onEditSubmit)} className="w-[100%] flex flex-col gap-10 p-6 sm:p-10">
                    <section className="flex flex-wrap gap-2 w-full">
                      <Controller
                        name="status_retorno"
                        control={control}
                        render={({ field }) => (
                          <Select
                            selectedKeys={field.value ? new Set([field.value]) : new Set()}
                            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                            label="Status do procedimento"
                            className="w-[100%]"
                          >
                            <SelectItem className='text-black' key="aguardando procedimento">Aguardando procedimento</SelectItem>
                            <SelectItem className='text-black' key="retorno">Retorno</SelectItem>
                            <SelectItem className='text-black' key="finalizado">Finalizado</SelectItem>
                          </Select>
                        )}
                      />
                      <Controller
                        name="dt_realizacao"
                        control={control}
                        rules={{ required: 'Obrigatório' }}
                        render={({ field }) => (
                          <DateInput
                            value={field.value ? parseDate(field.value) : null}
                            onChange={(v) => field.onChange(v?.toString() ?? '')}
                            endContent={<CalendarIcon />}
                            label="Data"
                            isRequired
                            errorMessage={errors.dt_realizacao?.message}
                            className="w-[48%]"
                          />
                        )}
                      />
                      <Controller
                        name="num_retorno"
                        control={control}
                        render={({ field }) => {
                          const { name, ref, onBlur, onChange, value } = field;
                          return (
                            <Input
                              name={name}
                              ref={ref}
                              type="number"
                              label="N° retorno"
                              isRequired
                              errorMessage={errors.num_retorno?.message}
                              className="w-[50%]"
                              value={value === undefined || value === null ? '' : String(value)}
                              onBlur={onBlur}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const v = e.target.value;
                                if (v === '') {
                                  onChange(undefined);
                                  return;
                                }
                                const n = Number(v);
                                if (!Number.isNaN(n)) onChange(n);
                                else onChange(undefined);
                              }}
                            />
                          );
                        }}
                      />

                      <Controller
                        name="obs_procedimento"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label="Observações extras"
                            isRequired
                            errorMessage={errors.obs_procedimento?.message}
                            className="w-[100%]"
                          />
                        )}
                      />
                    </section>

                    {/* ---------- Versionamento de retornos (campo adicionado) ---------- */}
                    <section className="flex flex-wrap gap-2 w-full">
                      <div className="w-full bg-[rgba(155,127,103,0.06)] p-3 rounded flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Versionamento de retornos</h3>
                          <Button
                            type="button"
                            onClick={() =>
                              appendRetorno({
                                // novo retorno em branco
                                num_retorno: 0,
                                descricao: '',
                                dt_retorno: '',
                              })
                            }
                            className="text-white bg-[#7F634B]"
                            size="sm"
                          >
                            + Adicionar retorno
                          </Button>
                        </div>

                        {retornoFields.length === 0 ? (
                          <div className="text-sm text-[#75614e]">Nenhum retorno registrado para este procedimento.</div>
                        ) : (
                          retornoFields.map((f, idx) => (
                            <div key={f.id} className="w-full bg-white p-3 rounded shadow-sm flex flex-wrap gap-3 items-end">
                              <div className="flex flex-col w-[15%]">
                                <label className="text-sm">Nº retorno</label>
                                <Controller
                                  name={`retornos.${idx}.num_retorno`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type="number"
                                      value={field.value === undefined || field.value === null ? '' : String(field.value)}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        if (v === '') field.onChange(undefined);
                                        else {
                                          const n = Number(v);
                                          if (!Number.isNaN(n)) field.onChange(n);
                                        }
                                      }}
                                      className="w-full"
                                    />
                                  )}
                                />
                              </div>

                              <div className="flex flex-col w-[50%]">
                                <label className="text-sm">Descrição</label>
                                <Controller
                                  name={`retornos.${idx}.descricao`}
                                  control={control}
                                  render={({ field }) => <Input {...field} className="w-full" />}
                                />
                              </div>

                              <div className="flex flex-col w-[25%]">
                                <label className="text-sm">Data retorno</label>
                                <Controller
                                  name={`retornos.${idx}.dt_retorno`}
                                  control={control}
                                  render={({ field }) => (
                                    <DateInput
                                      value={field.value ? parseDate(field.value) : null}
                                      onChange={(d) => field.onChange(d?.toString() ?? '')}
                                      className="w-full"
                                    />
                                  )}
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={async () => {
                                    const dbId = (retornoFields[idx] as any).dbId as number | undefined;
                                    if (dbId) {
                                      if (!confirm('Remover esse retorno do banco?')) return;
                                      try {
                                        const del = await fetch(`${import.meta.env.VITE_API_URL}/procedimento/retornos/${dbId}`, {
                                          method: 'DELETE',
                                          headers: { ...authHeaders },
                                        });
                                        if (!del.ok) console.warn('DELETE retorno falhou', del.status);
                                      } catch (err) {
                                        console.error('erro delete retorno', err);
                                      }
                                    }
                                    removeRetornoField(idx);
                                  }}
                                  className="bg-red-500 text-white"
                                >
                                  Remover
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                    {/* ---------- fim versionamento ---------- */}

                    <div className="w-full flex flex-col gap-4">
                      <div className="flex gap-2 flex-wrap">
                        {(procedimento?.fotos ?? []).length ? (
                          (procedimento?.fotos ?? [])
                            .slice()
                            .sort((a, b) => (a.ordem ?? Number.POSITIVE_INFINITY) - (b.ordem ?? Number.POSITIVE_INFINITY))
                            .map((f) => (
                              <div key={f.id} className="w-[200px] flex flex-col gap-1 items-center">
                                <img src={f.url} alt={`foto-${f.id}`} className="w-[200px] h-[140px] object-cover rounded-md" />
                                <div className="flex gap-2">
                                  <Button size="sm" type="button" onClick={() => triggerReplace(f.id)} disabled={uploading}>Substituir</Button>
                                  <Button size="sm" type="button" onClick={() => handleDeleteFoto(f.id)} disabled={uploading}>Excluir</Button>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="w-full h-48 bg-black flex items-center justify-center text-white">Sem fotos</div>
                        )}
                      </div>

                      <div className="flex justify-center">
                        <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={!idProcedimento || uploading} className="text-white bg-[#7F634B]">
                          {uploading ? 'Enviando…' : 'Carregar imagens'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap w-full sm:flex-nowrap gap-2 justify-center">
                      <Button size="lg" type="submit" className="w-[15%] text-white bg-[#7F634B]">
                        Salvar
                      </Button>
                    </div>
                  </HForm>
                </FormProvider>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ListagemProcedimentoPage;

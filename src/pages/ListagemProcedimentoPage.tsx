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
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';

export type FormValues = Omit<Procedimento, 'id'>;

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg aria-hidden="true" fill="none" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
    <path
      d="M7.75 2.5a.75.75 0 0 0-1.5 0V4H4.75A2.75 2.75 0 0 0 2 6.75v11.5A2.75 2.75 0 0 0 4.75 21h14.5A2.75 2.75 0 0 0 22 18.25V6.75A2.75 2.75 0 0 0 19.25 4H17V2.5a.75.75 0 0 0-1.5 0V4H8.5V2.5zM4.75 5.5h14.5c.69 0 1.25.56 1.25 1.25V9H3.5V6.75c0-.69.56-1.25 1.25-1.25zM3.5 10h17v8.25c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25V10z"
      fill="currentColor"
    />
  </svg>
);

function ListagemProcedimentoPage() {
  const { token, user } = useTokenStore();
  const [searchParams] = useSearchParams();
  const usuarioId = searchParams.get('usuario_id');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<'antes' | 'depois' | null>(null);

  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();
  const [procedimento, setProcedimento] = useState<Procedimento>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [idProcedimento, setIdProcedimento] = useState<number>();

  const formik = useFormik({
    initialValues: {
      parametro: usuario?.id_tipo_usuario === 1 ? 'nome' : 'status',
      valorBusca: '',
    },
    enableReinitialize: true,
    onSubmit: async ({ parametro, valorBusca }) => {
      const url = new URL(`${import.meta.env.VITE_API_URL}/procedimentos`)
      if (usuarioId) url.searchParams.set('usuario_id', usuarioId)
      if (valorBusca) url.searchParams.set(parametro, valorBusca)

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: Procedimento[] = await res.json()

      const withUrls = await Promise.all(
        data.map(async p => {
          if (p.foto_antes) p.foto_antes = await fetchFotoUrl(p.id, 'antes')
          if (p.foto_depois) p.foto_depois = await fetchFotoUrl(p.id, 'depois')
          return p
        })
      )
      setProcedimentos(withUrls)
    },
  });

  async function fetchFotoUrl(
    idProcedimento: number,
    tipo: 'antes' | 'depois'
  ): Promise<string> {
    const resp = await fetch(
      `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}/url/${tipo}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const { url } = await resp.json();
    return url;
  }

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user.id}`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsuario)
      .catch(console.error);
  }, [token, user?.id]);

  const fetchProcedimentos = async () => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/procedimentos`);
    if (usuarioId) url.searchParams.set('usuario_id', usuarioId);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Procedimento[] = await res.json();
    const withUrls = await Promise.all(
      data.map(async (p) => {
        if (p.foto_antes) p.foto_antes = await fetchFotoUrl(p.id, 'antes');
        if (p.foto_depois) p.foto_depois = await fetchFotoUrl(p.id, 'depois');
        return p;
      })
    );
    setProcedimentos(withUrls);
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
    },
  });
  const { reset, handleSubmit, control, formState: { errors } } = methods;

  useEffect(() => {
    if (!idProcedimento) return
    (async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data: Procedimento = await res.json()

      if (data.foto_antes) data.foto_antes = await fetchFotoUrl(data.id, 'antes')
      if (data.foto_depois) data.foto_depois = await fetchFotoUrl(data.id, 'depois')

      setProcedimento(data)
      reset({
        dt_realizacao: data.dt_realizacao || '',
        dt_ultimo_retorno: data.dt_ultimo_retorno || '',
        obs_procedimento: data.obs_procedimento || '',
        num_retorno: data.num_retorno ?? 0,
        status_retorno: data.status_retorno || '',
      })
      onOpen()
    })().catch(console.error)
  }, [idProcedimento, token, reset, onOpen])

  const onEditSubmit = async (values: FormValues) => {
    if (!idProcedimento) return;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      }
    );
    if (res.ok) {
      onClose();
      fetchProcedimentos();
    }
  };

  const handleFileChange = () => {
    if (!fileInputRef.current?.files?.length || !uploading || !idProcedimento) return;
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch(
      `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}/upload/${uploading}`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }
    )
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          console.error('Upload falhou:', res.status, body);
          return null;
        }
        return body;
      })
      .then((body) => {
        if (!body) return;
        const { url } = body;
        setProcedimento(prev => prev ? { ...prev, [uploading === 'antes' ? 'foto_antes' : 'foto_depois']: url } : prev);
        fetchProcedimentos();
      })
      .catch(console.error)
      .finally(() => {
        setUploading(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

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
                  nome_cliente={p.orcamento.usuario.nome}
                  procedimento_nome={p.nome_procedimento}
                  dt_realizacao={p.dt_realizacao}
                  status={p.status_retorno}
                  foto_antes={p.foto_antes || ''}
                  foto_depois={p.foto_depois || ''}
                  num_retorno={p.num_retorno}
                  usuario_id_tipo={usuario?.id_tipo_usuario ?? 0}
                  onclick={() => {
                    if (usuario?.id_tipo_usuario === 2) return;
                    setIdProcedimento(p.id);
                    onOpen();
                  }}
                />
              ))
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

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
                    <div className="w-full flex flex-col sm:flex-row gap-5 p-2">
                      {(['antes', 'depois'] as const).map((type) => (
                        <div key={type} className="w-full sm:w-[50%] flex flex-col justify-center items-center rounded-md bg-[#9B7F67] gap-2 p-2">
                          {procedimento?.[type === 'antes' ? 'foto_antes' : 'foto_depois'] ? (
                            <img
                              src={procedimento[type === 'antes' ? 'foto_antes' : 'foto_depois']!}
                              alt={type}
                              className="w-full h-auto object-contain rounded-md"
                            />
                          ) : (
                            <div className="w-full h-96 bg-black" />
                          )}
                          <p className="capitalize text-white text-lg">{type}</p>
                          <Button
                            type="button"
                            className="text-white bg-[#7F634B] px-4 py-2 rounded"
                            onClick={() => {
                              setUploading(type);
                              fileInputRef.current?.click();
                            }}
                            disabled={!idProcedimento || uploading !== null}
                          >
                            {uploading === type ? 'Enviando…' : 'Carregar imagem'}
                          </Button>
                        </div>
                      ))}
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

import { useTokenStore } from '../hooks/useTokenStore';
import { useEffect, useState } from "react";
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
} from "@heroui/react";

import { DateInput } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { ProcedimentoCard } from '../components/ProcedimentoCard';
import type { Procedimento } from '../interfaces/Procedimento';
import type { Usuario } from '../interfaces/Usuario';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';

export type FormValues = Omit<Procedimento, 'id'> & {
};

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg aria-hidden="true" fill="none" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" {...props}>
    <path d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58..." fill="currentColor" />
  </svg>
);

function ListagemProcedimentoPage() {

  const { token, user } = useTokenStore();
  const [searchParams] = useSearchParams();
  const pacienteNome = searchParams.get('nome');

  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();
  const [procedimento, setProcedimento] = useState<Procedimento>();
  const [parametro, setParametro] = useState<'nome' | 'status' | 'dt_realizacao'>('nome');
  const [valorBusca, setValorBusca] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [idProcedimento, setIdProcedimento] = useState<number>()


  useEffect(() => {
    (async () => {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );
      setUsuario(await resp.json());
    })();
  }, [token, user?.id]);

  const fetchProcedimentos = async () => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/procedimentos`);
    if (pacienteNome) {
      url.searchParams.set('nome', pacienteNome);
    }
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data: Procedimento[] = await response.json();
    setProcedimentos(data);
  };

  useEffect(() => {
    fetchProcedimentos();
  }, [token]);


  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      const params = new URLSearchParams();
      if (valorBusca) params.set(parametro, valorBusca);
      const url = new URL(`${import.meta.env.VITE_API_URL}/procedimentos?${params.toString()}`)
      if (pacienteNome) {
        url.searchParams.set('nome', pacienteNome);
      }
      const resp = await fetch(
        url.toString(),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );
      setProcedimentos(await resp.json());
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: {
      dt_realizacao: "",
      dt_ultimo_retorno: "",
      obs_procedimento: "",
      num_retorno: undefined,
      status_retorno: ""
    }
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors }
  } = methods;

  useEffect(() => {
    if (!idProcedimento) return;
    (async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data: Procedimento = await res.json();
      setProcedimento(data);
      reset({
        dt_realizacao: data.dt_realizacao ?? '',
        dt_ultimo_retorno: data.dt_ultimo_retorno ?? '',
        obs_procedimento: data.obs_procedimento ?? '',
        num_retorno: data.num_retorno ?? 0,
        status_retorno: data.status_retorno ?? ''
      });
    })();
  }, [idProcedimento, token, reset]);

  const onSubmit = async (values: FormValues) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/procedimento/${idProcedimento}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      }
    );

    if (res.ok) {
      onClose();
      await fetchProcedimentos();
    }
  };
  return (
    <div className="flex flex-col gap-4 items-center w-screen">
      <Form
        className="w-[95%] sm:w-[80%] flex flex-col gap-4 bg-[rgba(155,127,103,0.26)] p-4 rounded-md"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-wrap gap-4 w-full justify-start items-center">
          { }
          <Select
            className="max-w-xs"
            label="Pesquisar por"
            placeholder="Campo"
            selectedKeys={new Set([parametro])}
            onSelectionChange={(keys) => {
              const sel = Array.from(keys)[0] as typeof parametro;
              setParametro(sel);
              setValorBusca('');
            }}
          >
            <SelectItem className='text-black' key="nome">Nome</SelectItem>
            <SelectItem className='text-black' key="status">Status</SelectItem>
            <SelectItem className='text-black' key="dt_realizacao">Data de Retorno</SelectItem>
          </Select>
          {parametro === 'nome' && (
            <Input
              className="flex-1 w-[80%]"
              label="Nome do paciente"
              placeholder="Digite o nome"
              value={valorBusca}
              onChange={(e) => setValorBusca(e.target.value)}
            />
          )}
          {parametro === 'status' && (
            <Select
              className="max-w-xs"
              label="Status"
              placeholder="Selecione"
              selectedKeys={new Set([valorBusca])}
              onSelectionChange={(keys) => {
                const sel = Array.from(keys)[0] ?? '';
                setValorBusca(sel);
              }}
            >
              <SelectItem className='text-black' key="aguardando procedimento">Aguardando</SelectItem>
              <SelectItem className='text-black' key="finalizado">Finalizado</SelectItem>
              <SelectItem className='text-black' key="retorno">Retorno</SelectItem>
            </Select>
          )}
          {parametro === 'dt_realizacao' && (
            <DateInput
              className="max-w-xs"
              label="Data de Retorno"
              value={valorBusca ? parseDate(valorBusca) : null}
              onChange={(d) => setValorBusca(d?.toString() ?? '')}
            />
          )}

          <Button size="lg" type="submit" className="text-white bg-[#7F634B]">
            Buscar
          </Button>
        </div>
      </Form>
      <div className="w-[90%] flex flex-col gap-5 p-4 bg-[rgba(155,127,103,0.26)] rounded-sm">
        {procedimentos
          .filter((p) => p.orcamento?.usuario)
          .map((p, i) => (
            <>
              <ProcedimentoCard
                key={i}
                nome_cliente={p.orcamento.usuario.nome}
                procedimento_nome={p.nome_procedimento}
                dt_realizacao={p.dt_realizacao}
                status={p.status_retorno}
                num_retorno={p.num_retorno}
                usuario_id_tipo={usuario?.id_tipo_usuario ?? 0}
                onclick={() => {
                  setIdProcedimento(p.id);
                  onOpen();

                }}
              />
            </>
          ))}
      </div>

      <Modal className='bg-[#e5ded8]' isOpen={isOpen} size={'3xl'} onClose={onClose}>
        <ModalContent className='text-black'>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edição de procedimento</ModalHeader>
              <ModalBody className="flex h-full flex-col  items-center p-2">
                <FormProvider {...methods}>
                  <HForm
                    className="w-[100%]  flex flex-col gap-10 p-6 sm:p-10"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <section className="flex flex-wrap gap-2 w-full">
                      <Controller
                        name="status_retorno"
                        control={control}
                        render={({ field }) => (
                          <Select
                            selectedKeys={field.value ? new Set([field.value]) : new Set()}
                            onSelectionChange={keys => field.onChange(Array.from(keys)[0])}
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
                        rules={{ required: "Obrigatório" }}
                        render={({ field }) => (
                          <DateInput
                            value={field.value ? parseDate(field.value) : null}
                            onChange={v => field.onChange(v?.toString() ?? "")}
                            label="Data"
                            endContent={<CalendarIcon />}
                            isRequired
                            errorMessage={errors.dt_realizacao?.message}
                            className="w-[48%]"
                          />
                        )}
                      />
                      <Controller
                        name={'num_retorno'}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label={'N° retorno'}
                            isRequired
                            errorMessage={errors.num_retorno?.message}
                            className={"w-[50%]"}
                          />
                        )}
                      />
                      <Controller
                        name={'obs_procedimento'}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label={'Observações extras'}
                            isRequired
                            errorMessage={errors.obs_procedimento?.message}
                            className={"w-[100%]"}
                          />
                        )}
                      />
                    </section>
                    <div className="flex flex-wrap w-full sm:flex-nowrap gap-2 justify-center">
                      <Button size="lg" className="w-[15%] text-white bg-[#7F634B]" type="submit">
                        Salva
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

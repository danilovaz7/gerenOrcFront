import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, Form as HForm, useDisclosure, Alert, } from "@heroui/react";
import { useNavigate } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import logoPNG from '../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser, token, user } = useTokenStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mensagem, setMensagem] = useState('')
  const [mensagemCor, setMensagemCor] = useState<"default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>(undefined)
  const [hidePass, setHidePass] = useState(true);


  useEffect(() => {
    if (token && user) {
      navigate('/home');
    }
  }, [token, user, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const email = (data as any).email;
      const senha = (data as any).senha;    
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });



      if (!response.ok) {
        console.error('Erro no login:', await response.text());
        setMensagem('Erro no login')
        setMensagemCor('danger')
        return;
      }

      const { token: loginToken } = await response.json();

      const userResp = await fetch(`${import.meta.env.VITE_API_URL}/eu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginToken}`
        },
      });

      if (!userResp.ok) {
        console.error('Erro ao obter dados do usuário:', await userResp.text());
        setMensagem('Erro ao obter dados do usuário')
        setMensagemCor('danger')
        return;
      }

      const userData = await userResp.json();

      setToken(loginToken);
      setUser(userData);
      localStorage.setItem('token', loginToken);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const methods = useForm({
    defaultValues: {
      email: "",
    }
  });

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = methods;

  const submitdModal = async (values: any) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      }
    );

    if (res.ok) {
      setMensagem('Link de recuperação enviado para o seu e-mail.');
      setMensagemCor('success')
      setTimeout(() => onClose(), 3000);
    } else {
      setMensagem('Ocorreu um erro, tente novamente.');
      setMensagemCor('danger')
    }
  };


  return (
    <div className="w-screen min-h-screen flex items-center justify-center ">
      <div className="w-[90%] md:w-[30%] bg-[#ece7e2] p-6 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img src={logoPNG} alt="Logo" className="h-30 w-auto" />
        </div>
        <Form onSubmit={onSubmit} className="space-y-4 flex flex-col justify-center items-center">
          <Input
            isRequired
            variant="bordered"
            errorMessage="Coloque um email válido"
            name="email"
            placeholder="Email"
            type="email"
            className="w-full text-black border-2 border-[#9B7F67] rounded-xl"
          />
          <Input
            isRequired
            variant="bordered"
            errorMessage="Esqueceu a senha"
            name="senha"
            placeholder="Senha"
            type={hidePass ? "password" : "text"}
            className="w-full border-2 text-black border-[#9B7F67] rounded-xl"
            endContent={
              <div className='cursor-pointer flex items-center justify-center bg-[#ece7e2] ' onClick={() => setHidePass(!hidePass)}>
                {hidePass ? <FaRegEye className="w-full text-black" /> : <FaRegEyeSlash className="w-full text-black" />}
              </div>
            }
          />
          {
            mensagem ?
              <div className="flex items-center justify-center w-full">
                <Alert color={mensagemCor} variant="faded" title={mensagem} className="w-[50%]" />
              </div>
              : null
          }
          <Button type="submit" size="lg" className="w-full bg-[#9B7F67] tracking-wider">
            Entrar
          </Button>
          <p onClick={() => { onOpen(); }} className="text-blue-600 underline hover:cursor-pointer">Esqueci minha senha!</p>
        </Form>
      </div>



      <Modal className='bg-[#e5ded8]' isOpen={isOpen} size={'2xl'} onClose={onClose}>
        <ModalContent className='text-black'>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Recuperação de senha</ModalHeader>
              <ModalBody className="flex h-full flex-col  items-center p-2">
                <FormProvider {...methods}>
                  <HForm
                    className="w-[100%]  flex flex-col gap-10 p-6 sm:p-10"
                    onSubmit={handleSubmit(submitdModal)}
                  >
                    <section className="flex flex-wrap gap-2 w-full">
                      <Controller
                        name={'email'}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            label={'E-mail para verificação'}
                            isRequired
                            errorMessage={errors.email?.message}
                            className={"w-[100%]"}
                          />
                        )}
                      />
                    </section>
                    {
                      mensagem ?
                        <div className="flex items-center justify-center w-full">
                          <Alert color={mensagemCor} variant="faded" title={mensagem} className="w-[50%]" />
                        </div>
                        : null
                    }
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

export default LoginPage;

import React, { useEffect } from "react";
import { Form, Input, Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { useTokenStore } from '../hooks/useTokenStore';

function LoginPage() {
  const navigate = useNavigate();

  const { setToken, setUser, token, user } = useTokenStore();

  useEffect(() => {
    if (token && user) {
      navigate('/home');
    }
  }, [token, user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      let email = data.email
      let senha = data.senha

      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro no login:', errorText);

        return;
      }
      const { token: loginToken } = await response.json();

      const respostaEu = await fetch(`${import.meta.env.VITE_API_URL}/eu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginToken}`,
        },
      });

      if (!respostaEu.ok) {
        const errorText = await respostaEu.text();
        console.error('Erro ao obter dados do usuário:', errorText);

        return;
      }

      const userData = await respostaEu.json();

      setToken(loginToken);
      setUser(userData);

      localStorage.setItem('token', loginToken);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);

    }
  };

  return (
    <div className=' w-screen h-screen flex flex-col justify-center items-center' >
      <div className="w-[60%]  flex-col flex justify-center items-center p-5 ">
        <div className="w-[50%]">
          <img className="w-full" src="../src/assets/logo.PNG" alt="" />
        </div>
        <Form className="w-[50%] flex flex-col items-center  justify-center" onSubmit={onSubmit}>
          <Input
            isRequired
            errorMessage="Coloque um email valido"
            name="email"
            className="bg-transparent border-2 border-[#9B7F67] rounded-xl "
            placeholder="Coloque seu email"
            type="email"
          />
          <Input
            isRequired
            errorMessage="Esqueceu a senha"
            name="senha"
            className="bg-transparent border-2 border-[#9B7F67] rounded-xl "
            placeholder="Coloque sua senha"
            type="password"
          />
          <Button
            type="submit"
            className="w-[40%] mt-5 bg-[#9B7F67] tracking-wider"
            size="lg"
          >
            Entrar
          </Button>
        </Form>
      </div>

    </div>
  )
}

export default LoginPage


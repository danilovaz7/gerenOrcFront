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
        return;
      }

      const { token: loginToken } = await response.json();
      const userResp = await fetch(`${import.meta.env.VITE_API_URL}/eu`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${loginToken}` },
      });

      if (!userResp.ok) {
        console.error('Erro ao obter dados do usuário:', await userResp.text());
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

  return (
    <div className="w-screen min-h-screen flex items-center justify-center ">
      <div className="w-[90%] md:w-[30%] bg-[#ece7e2] p-6 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img src="../src/assets/logo.PNG" alt="Logo" className="h-30 w-auto" />
        </div>
        <Form onSubmit={onSubmit} className="space-y-4">
          <Input
            isRequired
            errorMessage="Coloque um email válido"
            name="email"
            placeholder="Email"
            type="email"
            className="w-full bg-transparent border-2 border-[#9B7F67] rounded-xl"
          />
          <Input
            isRequired
            errorMessage="Esqueceu a senha"
            name="senha"
            placeholder="Senha"
            type="password"
            className="w-full bg-transparent border-2 border-[#9B7F67] rounded-xl"
          />
          <Button type="submit" size="lg" className="w-full bg-[#9B7F67] tracking-wider">
            Entrar
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;

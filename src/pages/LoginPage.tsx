import React from "react";
import { Form, Input, Button } from "@heroui/react";
import { useNavigate } from "react-router";

function App() {
  const [submitted, setSubmitted] = React.useState(null);
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSubmitted(data);
    navigate('/home');
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
            placeholder="Enter your email"
            type="email"
          />
          <Input
            isRequired
            errorMessage="Esqueceu a senha"
            name="password"
            className="bg-transparent border-2 border-[#9B7F67] rounded-xl "
            placeholder="Enter your password"
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

export default App

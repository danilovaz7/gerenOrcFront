import { useEffect, useState } from "react";
import {
    Input,
    Button,
    Alert,
    Form as HForm,
    useDisclosure,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";

type FormValues = {
    senha: string;
    confirmarSenha: string;
};

export default function RedefinirSenhaPage() {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const { onClose } = useDisclosure();

    const [mensagem, setMensagem] = useState("");
    const [mensagemCor, setMensagemCor] =
        useState<"default" | "primary" | "secondary" | "success" | "warning" | "danger">();
    const [erroSenha, setErroSenha] = useState("");
    const [erroConfirmSenha, setErroConfirmSenha] = useState("");

   
    const validatePassword = (values: FormValues) => {
        console.log('to aqui')
        const errors: { senha?: string; confirmarSenha?: string } = {};
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        console.log(passwordRegex.test(values.senha))
        setErroSenha("");
        setErroConfirmSenha("");

        if (!passwordRegex.test(values.senha)) {
            errors.senha =
                "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.";
            setErroSenha(errors.senha);
            console.log(errors.senha)
        }

        console.log(values.senha !== values.confirmarSenha)
        if (values.senha !== values.confirmarSenha) {
            errors.confirmarSenha = "As senhas devem coincidir.";
            setErroConfirmSenha(errors.confirmarSenha);
            console.log(errors.confirmarSenha)
        }
        console.log('errors', errors)
        return errors;
    };

    const methods = useForm<FormValues>({
        defaultValues: {
            senha: "",
            confirmarSenha: "",
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (values: FormValues) => {
        console.log(values)
        const errors = validatePassword(values);
        if (Object.keys(errors).length > 0) {
            console.log('tem erros me pae')
            return;
        }
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/reset-password/${token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ senha: values.senha }),
            }
        );

        if (res.ok) {
            setMensagem("Senha redefinida com sucesso!");
            setMensagemCor("success");
            setTimeout(() => {
                onClose();
                navigate("/");
            }, 2000);
        } else {

            setMensagem("Ocorreu um erro, tente novamente.");
            setMensagemCor("danger");
        }
    };

    useEffect(() => {
        if (!token) {
            setMensagem("Token inválido ou expirado.");
            setMensagemCor("danger");
        }
    }, [token]);

    return (
        <div className="w-screen min-h-screen flex items-center justify-center">
            <FormProvider {...methods}>
                <HForm
                    className=" w-full sm:w-[50%] flex flex-col justify-center items-center gap-10 p-6 sm:p-10"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <section className="flex flex-wrap gap-2 justify-center items-center w-full sm:w-[70%] bg-[#ece7e2] shadow-md rounded-lg px-2 py-12">
                        <h1 className="text-[#7F634B] text-3xl sm:text-5xl text-center">Redefina sua senha!</h1>
                        <p className="text-[#7F634B] text-center">
                            Para conseguir redefinir sua senha basta digitar sua nova senha e
                            confirmar
                        </p>
                        <Controller
                            name="senha"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
                                    label="Insira sua nova senha"
                                    isRequired
                                    errorMessage={erroSenha}
                                    className=" w-[90%] sm:w-[80%]"
                                />
                            )}
                        />
                        {
                            erroSenha ?
                                <div className="flex items-center justify-center w-full">
                                    <Alert color={'danger'} variant="faded" title={erroSenha} className="w-[50%]" />
                                </div>
                                : null
                        }
                        <Controller
                            name="confirmarSenha"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
                                    label="Confirme sua senha"
                                    isRequired
                                    errorMessage={erroConfirmSenha}
                                    className="w-[90%] sm:w-[80%]"
                                />
                            )}
                        />
                        {
                            erroConfirmSenha ?
                                <div className="flex items-center justify-center w-full">
                                    <Alert color={'danger'} variant="faded" title={erroConfirmSenha} className="w-[50%]" />
                                </div>
                                : null
                        }
                    </section>

                    {mensagem && (
                        <div className="flex items-center justify-center w-full">
                            <Alert
                                color={mensagemCor}
                                variant="faded"
                                title={mensagem}
                                className="w-[50%]"
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap w-full sm:flex-nowrap gap-2 justify-center">
                        <Button
                            size="lg"
                            className="w-[15%] text-white bg-[#7F634B]"
                            type="submit"
                            isDisabled={isSubmitting}
                        >
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </HForm>
            </FormProvider>
        </div>
    );
}

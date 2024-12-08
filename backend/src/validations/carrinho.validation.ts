import * as yup from "yup";

export const carrinhoValidation = yup.object().shape({
    produtoId: yup.number().required("O ID do produto é obrigatório."),
    quantidade: yup
        .number()
        .min(1, "A quantidade deve ser pelo menos 1.")
        .required("A quantidade é obrigatória."),
});

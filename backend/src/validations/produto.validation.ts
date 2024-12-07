import * as yup from "yup";

export const produtoValidation = yup.object().shape({
    name: yup
        .string()
        .required("O nome do produto é obrigatório.")
        .min(3, "O nome deve ter pelo menos 3 caracteres.")
        .max(50, "O nome pode ter no máximo 50 caracteres."),
    price: yup
        .number()
        .required("O preço do produto é obrigatório.")
        .positive("O preço deve ser um número positivo.")
        .typeError("O preço deve ser um número."),
    unitType: yup
        .string()
        .required("O tipo de unidade é obrigatório.")
        .oneOf(["Unidade", "Quilo"], "O tipo de unidade deve ser 'Unidade' ou 'Quilo'."),
    quantity: yup
        .number()
        .required("A quantidade é obrigatória.")
        .integer("A quantidade deve ser um número inteiro.")
        .positive("A quantidade deve ser um número positivo.")
        .typeError("A quantidade deve ser um número."),
});

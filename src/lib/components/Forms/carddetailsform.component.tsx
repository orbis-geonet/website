import React from "react";
import { CustomInput } from "..";

const CardDetailsForm = () => {
  return (
    <form className="space-y-4 flex-1">
      <h2 className="text-xl font-bold">Cartão de crédito</h2>
      <CustomInput label="Nome no Cartão" type="text" />
      <CustomInput
        label="Número"
        type="text"
        placeholder="Digite somente números sem espaço"
        cardNumber={true}
      />
      <div className="flex gap-10">
        <CustomInput
          className="flex-1"
          label="Validade"
          type="text"
          placeholder="MM/YY"
        />
        <CustomInput
          className="flex-1"
          label="CVV"
          placeholder="EX: 975"
          type="text"
        />
      </div>
    </form>
  );
};

export default CardDetailsForm;

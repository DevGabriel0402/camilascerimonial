/**
  * Utility Masking Functions for Camila's Cerimonial Application
  */

// Máscara de Moeda R$ (ex: 350000 -> R$ 3.500,00)
export const maskCurrency = (value) => {
  if (!value) return '';
  let cleanValue = String(value).replace(/\D/g, '');
  if (!cleanValue) return '';
  
  const options = { minimumFractionDigits: 2 };
  const result = (parseFloat(cleanValue) / 100).toLocaleString('pt-BR', options);
  return `R$ ${result}`;
};

// Máscara de Telefone / WhatsApp (ex: (31) 98516-5246 ou (31) 3456-7890)
export const maskPhone = (value) => {
  if (!value) return '';
  let cleanValue = String(value).replace(/\D/g, '');
  if (cleanValue.length > 11) cleanValue = cleanValue.slice(0, 11);

  if (cleanValue.length <= 10) {
    return cleanValue
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return cleanValue
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

// Máscara de CPF (ex: 000.000.000-00)
export const maskCPF = (value) => {
  if (!value) return '';
  let cleanValue = String(value).replace(/\D/g, '').slice(0, 11);
  return cleanValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// Máscara de CNPJ (ex: 00.000.000/0001-00)
export const maskCNPJ = (value) => {
  if (!value) return '';
  let cleanValue = String(value).replace(/\D/g, '').slice(0, 14);
  return cleanValue
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

// Máscara dinâmica CPF ou CNPJ
export const maskCPFOrCNPJ = (value) => {
  if (!value) return '';
  const cleanValue = String(value).replace(/\D/g, '');
  if (cleanValue.length <= 11) {
    return maskCPF(cleanValue);
  } else {
    return maskCNPJ(cleanValue);
  }
};

// Máscara de CEP (ex: 30000-000)
export const maskCEP = (value) => {
  if (!value) return '';
  let cleanValue = String(value).replace(/\D/g, '').slice(0, 8);
  return cleanValue.replace(/^(\d{5})(\d)/, '$1-$2');
};

// Máscara de Data (ex: DD/MM/AAAA)
export const maskDate = (value) => {
  if (!value) return '';
  let cleanValue = String(value).replace(/\D/g, '').slice(0, 8);
  return cleanValue
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
};

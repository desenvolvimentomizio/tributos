const columnsEmpresas = [
  {
    name: 'identificacao',
    align: 'left',
    label: 'Identificacao',
    field: 'identificacao',
    sortable: true,
    style: 'width: 40%;'
  },
  {
    name: 'cnpj',
    align: 'left',
    label: 'CNPJ',
    field: 'cnpj',
    sortable: true,

    format: val => {
      if (!val) return ''
      return val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    },
    style: 'width: 15%;'
  },

  {
    name: 'inscricao_estadual',
    align: 'left',
    label: 'Inscrição Estadula',
    field: 'inscricao_estadual',
    sortable: true,
    style: 'width: 20%;'
  },

  {
    name: 'regime_id',
    label: 'Regime Tributário',
    field: 'regime_id',
    align: 'left',
    format: val => {
      const map = {
        1: 'Simples Nacional',
        2: 'Simples com Sub-limite',
        3: 'Regime Normal'
      }
      return map[val] || 'Desconhecido'
    },
     style: 'width: 25%;'
  },

  {
    name: 'cnae',
    align: 'left',
    label: 'CNAE',
    field: 'cnae',
    sortable: true,
    style: 'width: 10%;'
  },

  { name: 'actions', align: 'right', label: 'Funções', field: 'actions', sortable: false },
]

export { columnsEmpresas }

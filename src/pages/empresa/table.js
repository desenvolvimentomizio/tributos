const columnsEmpresas = [
  {
    name: 'identificacao',
    align: 'left',
    label: 'Identificacao',
    field: 'identificacao',
    sortable: true,
  },
  {
    name: 'cnpj',
    align: 'left',
    label: 'CNPJ',
    field: 'cnpj',
    sortable: true,
  },

  {
    name: 'inscricao_estadual',
    align: 'left',
    label: 'Inscrição Estadula',
    field: 'inscricao_estadual',
    sortable: true,
  },

  { name: 'actions', align: 'right', label: 'Funções', field: 'actions', sortable: false },
]

export { columnsEmpresas }

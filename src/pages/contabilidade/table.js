function aplicarMascaraData(val) {
  if (!val) return ''
  // espera formato 'aaaa-mm-dd' ou 'aaaa-mm-ddTHH:mm:ss'
  const soData = val.split('T')[0] // remove hora, se existir
  const [ano, mes, dia] = soData.split('-')
  return `${dia}/${mes}/${ano}`
}


const columnsContabilidade = [
  {
    name: 'identificacao',
    align: 'left',
    label: 'Identificacao',
    field: 'identificacao',
    sortable: true,
  },
  {
    name: 'telefone',
    align: 'left',
    label: 'Telefone',
    field: 'telefone',
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: false,
  },
  {
    name: 'data_fim',
    align: 'left',
    label: 'Desativação',
    field: 'data_fim',
    sortable: true,
    style: 'width :5%;',
    format: aplicarMascaraData,
  },


  { name: 'actions', align: 'right', label: 'Funções', field: 'actions', sortable: false },
]


export { columnsContabilidade }



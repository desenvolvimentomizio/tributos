function aplicarMascaraData(val) {
  if (!val) return ''
  // espera formato 'aaaa-mm-dd' ou 'aaaa-mm-ddTHH:mm:ss'
  const soData = val.split('T')[0] // remove hora, se existir
  const [ano, mes, dia] = soData.split('-')
  return `${dia}/${mes}/${ano}`
}

const columnsRegras = [
  {
    name: 'identificacao',
    align: 'left',
    label: 'Identificacao',
    field: 'identificacao',
    sortable: true,
    style: 'width: 15%;'
  },

  {
    name: 'cst_icm_csosn',
    align: 'left',
    label: 'CST/CSOSN',
    field: 'cst_icm_csosn',
    sortable: true,
    style: 'width: 3%;'
  },
  {
    name: 'cfop_interno',
    align: 'left',
    label: 'CFOP Int',
    field: 'cfop_interno',
    sortable: true,
    style: 'width: 3%;'
  },
  {
    name: 'icm_interno',
    align: 'left',
    label: '%',
    field: 'icm_interno',
    sortable: true,
    style: 'width: 3%;'
  },

  {
    name: 'cst_pis',
    align: 'left',
    label: 'CST PIS',
    field: 'cst_pis',
    sortable: true,
    style: 'width: 3%;'
  },
  {
    name: 'cst_cofins',
    align: 'left',
    label: 'CST COFINS',
    field: 'cst_cofins',
    sortable: true,
    style: 'width: 3%;'
  },
  {
    name: 'classificacao_ibscbs',
    align: 'left',
    label: 'IBS-CBS',
    field: 'classificacao_ibscbs',
    sortable: true,
    style: 'width: 3%;'
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

export { columnsRegras }

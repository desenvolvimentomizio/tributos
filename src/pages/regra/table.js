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
     style: 'width: 10%;'
  },
  {
    name: 'cst_csosn_icm',
    align: 'left',
    label: 'CST/CSOSN ICM',
    field: 'cst_csosn_icm',
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
    label: 'ICM Int',
    field: 'icm_interno',
    sortable: true,
    style: 'width: 3%;'
  },
   {
    name: 'cfop_externo',
    align: 'left',
    label: 'CFOP Ext',
    field: 'cfop_externo',
    sortable: true,
    style: 'width: 3%;'
  },
{
    name: 'icm_externo',
    align: 'left',
    label: 'ICM Ext',
    field: 'icm_externo',
    sortable: true,
    style: 'width: 3%;'
  },
   {
    name: 'cst_ipi',
    align: 'left',
    label: 'CST IPI',
    field: 'cst_ipi',
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
    name: 'pis_aliquota',
    align: 'left',
    label: 'PIS Alíquota',
    field: 'pis_aliquota',
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
   name:'data_inicio',
   align:'left',
   label:'Data Início',
   field:'data_inicio',
   sortable:true,
   style:'width :5%;'
  },
 {
   name:'data_fim',
   align:'left',
   label:'Data Fim',
   field:'data_fim',
   sortable:true,
   style:'width :5%;'
  },

  { name: 'actions', align: 'right', label: 'Funções', field: 'actions', sortable: false },
]

export { columnsRegras }

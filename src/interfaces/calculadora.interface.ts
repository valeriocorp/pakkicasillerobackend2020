
export interface ICalculadora{
    id?: string;
    peso: number;
    cantidad: boolean;
    valor: number;
    flete: number;
    iva: number;
    total: number;
    cantidadArticulo: number;
    valorLibra: number;
    leyDolar: number;
    reglaLibra:number;
    compramos: boolean;
    valorComision: number;
    fleteVariable: number;
    maxValor: number;
    maxPeso: number;
    arancel: number;
    minimoValorComision: number;
    condicionMinimoComision: number;
    nacional: boolean;
    fleteNacional: number;
    valorFleteNacional: number;
    seguroFleteNacional: number;
    seguro: boolean;
    BaseSeguro: number;
    valorSeguro: number;
}

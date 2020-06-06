import Knex from 'knex';

export async function seed(knex: Knex){
	await knex('itens').insert([
		{	titulo: 'Lampadas',imagem: 'lampadas.svg'	},
		{	titulo: 'Pilhas e Baterias',imagem: 'baterias.svg'	},
		{	titulo: 'Papeis e Papelao',imagem: 'papeis-papelao.svg'	},
		{	titulo: 'Residuos Eletronicos',imagem: 'eletronicos.svg'	},
		{	titulo: 'Residuos Organicos',imagem: 'organicos.svg'	},
		{	titulo: 'Oleos de Cozinha',imagem: 'oleos.svg'	},
	])
}
import {Request,Response} from 'express';
import knex from '../database/connection';

class PontosController{
	async create(request: Request,response: Response){
		const {
			nome,
			email,
			whatsapp,
			latitude,
			longitude,
			cidade,
			uf,
			itens
		} = request.body;

		const trx = await knex.transaction();
	
		const idsInseridos = await trx('pontos').insert({
			imagem: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
			nome,
			email,
			whatsapp,
			latitude,
			longitude,
			cidade,
			uf
		});
	
		const ponto_id = idsInseridos[0];
	
		const pontoItens = itens.map((item: number) =>{
			return {
				item_id: item,
				ponto_id: ponto_id,
			}
		});
	
		await trx('pontos_itens').insert(pontoItens)

		await trx.commit();
	
		return response.json({success: true});
	};

	async show(request: Request,response: Response){
		const { id } = request.params;

		const ponto = await knex('pontos').where('id',id).first();

		if(!ponto){
			return response.status(400).json({message: 'Ponto não encontrado'});
		}

		const itens  = await knex('itens')
		.join('pontos_itens','itens.id','=','pontos_itens.item_id')
		.where('pontos_itens.ponto_id',id)
		.select('itens.titulo');

		return response.json({ponto,itens});
	} 

	async index(request: Request,response: Response){
		const {cidade, uf, itens} = request.query;

		const parsedItens = String(itens)
			.split(',')
			.map(item =>Number(item.trim()))
		
		const pontos = await knex('pontos')
			.join('pontos_itens','pontos.id','=','pontos_itens.ponto_id')
			.whereIn('pontos_itens.item_id',parsedItens)
			.where('cidade', String(cidade))
			.where('uf',String(uf))
			.distinct()
			.select('pontos.*');

			return response.json(pontos)
	}

}

export default PontosController;
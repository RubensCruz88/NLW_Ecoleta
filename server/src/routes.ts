import express from 'express';
import ItensController from './controllers/itensController';
import PontosController from './controllers/pontosController';

const routes = express.Router();
const itensController = new ItensController();
const pontosController = new PontosController();

routes.get('/',(request,response)=>{
	return response.json({mensagem: 'Hello World'});	
})

routes.get('/itens',itensController.index);

routes.post('/pontos',pontosController.create);
routes.get('/pontos/:id',pontosController.show);
routes.get('/pontos/',pontosController.index);
routes.get('/concluido/',pontosController.index);


export default routes;
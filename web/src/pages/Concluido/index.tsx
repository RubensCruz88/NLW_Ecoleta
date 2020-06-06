import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import './styles.css';

const Concluido = () => {
	return(

		<div id="page-concluido">
			<div className="content">
				<main>
					<span className="icone">
						<FiCheckCircle />
					</span>
					<span className="mensagem">Ponto de coleta cadastrado com sucesso</span>
				</main>
			</div>
		</div>
	)
}

export default Concluido
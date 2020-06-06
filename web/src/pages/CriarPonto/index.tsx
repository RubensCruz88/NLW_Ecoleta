import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
	id: number,
	titulo: string,
	imagem_url: string
}

interface IBGE_UF_Response {
	sigla: string
}

interface IBGE_Cidade_Response {
	nome: string
}

const CriarPonto = () => {
	const [itens,setItens] = useState<Item[]>([]);
	const [ufs, setUfs] = useState<string[]>([]);
	const [cidades, setCidades] = useState<string[]>([]);
	const [itensSelecionados,setItensSelecionados] = useState<number[]>([]);

	const [dadoFormulario,setDadoFormulario] = useState({
		nome: '',
		email: '',
		whatsapp: ''
	})

	const [ufSelecionada, setUfSelecionada] = useState('0');
	const [cidadeSelecionada, setCidadeSelecionada] = useState('0');
	const [posicaoSelecionada,SetPosicaoSelecionada] = useState<[number,number]>([0,0]);
	const [posicaoInicial,setPosicaoInicial] = useState<[number,number]>([0,0]);

	const historico = useHistory();

	useEffect(() =>{
		api.get('itens').then(response =>{
			setItens(response.data);
		})
	},[]);

	useEffect(() => {
		axios.get<IBGE_UF_Response[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response =>{
			const siglas = response.data.map(uf => uf.sigla);

			setUfs(siglas);
		})
	},[])

	useEffect(() =>{
		if(ufSelecionada === '0'){
			return;
		}
		axios.get<IBGE_Cidade_Response[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios`).then(response =>{
			const cidadesNomes = response.data.map(cidade => cidade.nome);

			setCidades(cidadesNomes);
		})
	},[ufSelecionada])

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			const {latitude,longitude} = position.coords;

			setPosicaoInicial([latitude,longitude]);
			SetPosicaoSelecionada([latitude,longitude]);
		})
	},[])

	function manipUfSelecionada(event: ChangeEvent<HTMLSelectElement>){
		const uf = event.target.value;
		setUfSelecionada(uf);
	}

	function manipCidadeSelecionada(event: ChangeEvent<HTMLSelectElement>){
		const cidade = event.target.value;
		setCidadeSelecionada(cidade);
	}

	function manipMapaClick(event: LeafletMouseEvent){
		SetPosicaoSelecionada([
			event.latlng.lat,event.latlng.lng
		])
	}

	function manipMudancaInput(event: ChangeEvent<HTMLInputElement>){
		const {name,value} = event.target;
		
		setDadoFormulario({...dadoFormulario,[name]:value});
	}

	function manipItensSelecionados(id: number){
		const jaSelecionado = itensSelecionados.findIndex(item => item === id);

		if(jaSelecionado >= 0 ){
			const itensFiltados = itensSelecionados.filter(item => item !== id);

			setItensSelecionados(itensFiltados);
		}else{
			setItensSelecionados([...itensSelecionados,id]);
		}


	}

	async function manipEnvio(event: FormEvent){
		event.preventDefault();

		const { nome, email, whatsapp } = dadoFormulario;
		const uf = ufSelecionada;
		const cidade = ufSelecionada;
		const [latitude, longitude] = posicaoSelecionada;
		const itens = itensSelecionados;

		const dados = {
			nome,
			email,
			whatsapp,
			uf,
			cidade,
			latitude,
			longitude,
			itens
		}

//		await api.post('pontos',dados);

		historico.push('/concluido');
	}

	return (
		<div id="page-create-point">
			<header>
				<img src={logo} alt='Ecoleta' />
				<Link to="/">
					<FiArrowLeft />
					Voltar para home
				</Link>
			</header>

			<form onSubmit={manipEnvio}>
				<h1>Cadastro do ponto de coleta</h1>

				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>
				</fieldset>

				<div className="field">
					<label htmlFor="name">Nome da entidade</label>
					<input type="text" name="nome" id="nome" onChange={manipMudancaInput}></input>
				</div>

				<div className="field-group">
					<div className="field">
						<label htmlFor="email">E-mail</label>
						<input type="email" name="email" id="email" onChange={manipMudancaInput}></input>
					</div>
					<div className="field">
						<label htmlFor="whatsapp">Whatsapp</label>
						<input type="text" name="whatsapp" id="whatsapp" onChange={manipMudancaInput}></input>
					</div>
				</div>

				<fieldset>
					<legend>
						<h2>Endereco</h2>
						<span>Selecione o endereco no mapa</span>
					</legend>

					<Map center={posicaoInicial} zoom={15} onClick={manipMapaClick}>
						<TileLayer 
							attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					  	/>
						  <Marker position={posicaoSelecionada} />
					</Map>

					<div className="field-group">
						<div className="field">
							<label htmlFor="uf">Estado (UF)</label>
							<select name="uf" id="uf" value={ufSelecionada} onChange={manipUfSelecionada}>
								<option value="0">Selecione uma UF</option>
								{ufs.map(uf =>(
									<option value={uf} key={uf}>{uf}</option>
								))}
							</select>
						</div>

						<div className="field">
							<label htmlFor="city">Cidade</label>
							<select name="city" id="city" onChange={manipCidadeSelecionada}>
								<option value="0">Selecione uma cidade</option>
								{cidades.map(cidade =>(
									<option value={cidade} key={cidade}>{cidade}</option>
								))}
							</select>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Itens de coleta</h2>
						<span>Selecione um ou mais links abaixo</span>
					</legend>
				</fieldset>

				<ul className="items-grid">
					{itens.map(item=>(
						<li 
							key={item.id} 
							onClick={() => manipItensSelecionados(item.id)}
							className={itensSelecionados.includes(item.id) ? 'selected' : ''}
						>
							<img src={item.imagem_url} alt={item.titulo}></img>
							<span>{item.titulo}</span>
						</li>
					))}
				</ul>

				<button type="submit">
					Cadastrar ponto de coleta
				</button>
			</form>
		</div>
	)
}

export default CriarPonto;
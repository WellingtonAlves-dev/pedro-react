import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Container, Row, Col, Table} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';


function Loading() {
    return (
        <div style={{textAlign: "center"}}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <h1>Carregando...</h1>
        </div>
    )
}

function Tabela({ data }) {
    const [pedido, setPedido] = useState("");

    return (
    <>
        <input type="text" value={pedido} onChange={e => setPedido(e.target.value)} className='form-control' placeholder='Pesquisar N pedido' />
        <Table>
        <thead>
            <tr>
                <th>Data/Hora volta</th>
                <th>Data/Hora ida</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Número do pedido</th>
                <th>Número do bilhete</th>
                <th>Número da transação total Bus</th>
                <th>Companhia de ônibus</th>
                <th>Tipo de leito</th>
                <th>Nome dos passageiros</th>
                <th>Número do documento</th>
                <th>Valor da poltrona(milhas)</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {data?.map(pass => {
                if(pedido) {
                    if(pass.pedido != pedido) return;
                }
                return (
                    <tr>

                        <td>{ pass.data_volta }</td>
                        <td>{ pass.data_ida }</td>
                        <td>{ pass.origem }</td>
                        <td>{ pass.destino }</td>
                        <td>{ pass.pedido }</td>
                        <td>{ pass.bilhete }</td>
                        <td>{ pass.transacao_bus }</td>
                        <td>{ pass.com_bus }</td>
                        <td>{ pass.legs }</td>
                        <td>{ pass.nome }</td>
                        <td>{ pass.numero_documento }</td>
                        <td>{ pass.valor_poltrona }</td>
                        <td></td>

                    </tr>
                )
            })}
        </tbody>
    </Table>
    </>
    )
}

export default function Passagens() {
    const passagens = useQuery(["passagens"], async () => {
        let data_return = await fetch("http://127.0.0.1:8000/data");
        let json = await data_return.json();
        return json;
    }); 

    function gerarPassageiro(data) {
        if(!data) return;
        let passageiros = [];
        for(let passagem of data) {
            //percorrer os segmentos
            for(let segmento of passagem.segments) {
                for(let perna of segmento.legs) {
                    for(let assento of perna.seats) {
                        let passageiro = assento.passenger;
                        passageiros.push({
                            "nome": passageiro.firstName + " " + passageiro.lastName,
                            "numero_documento": passageiro.documentNumber,
                            "valor_poltrona": assento.costMiles,
                            "leito": assento.bookingClass,
                            "com_bus": perna.busCompanyName,
                            "transacao_bus": "não sei",
                            "bilhete": assento.ticketNumber,
                            "pedido": passagem.orderId,
                            "origem": perna.departureCity,
                            "destino": perna.arrivalCity,
                            "data_ida": "Não sei",
                            "data_volta": "Não Sei"
                        });
                    }
                }
            }
        }
        return passageiros;
    }

    return (
        <>
            <Container className='mt-5'>
            <Row className='justify-content-center'>
                <Col xs={12}>
                    <h1>Passagens Mobífácil</h1>
                </Col>
                <Col xs={12}>
                    { passagens.isLoading && <Loading/> }
                    { !passagens.isLoading && <Tabela data={gerarPassageiro(passagens.data)}/> }
                </Col>
            </Row>
            </Container>
        </>
    )
}
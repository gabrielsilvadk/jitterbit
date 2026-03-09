PROJECT CREATED BASED ON JITTERBIT CHALLENGE

PROJECT API ORDER

Deverá desenvolver uma API em node.js usando o javascript. 
Seu desafio é criar uma API simples para gerenciar os pedidos. A API deve permitir a criação, leitura, atualização e exclusão de pedidos. 
Criar endpoints para as seguintes operações: 
● Criar um novo pedido. (Obrigatório). 
URL: http://localhost:3000/order 
● Obter os dados do pedido passando por parâmetro na URL o número do pedido. (Obrigatório) URL: http://localhost:3000/order/v10089016vdb 
● Listar todos os pedidos. (Opcional) 
URL: http://localhost:3000/order/list 
● Atualizar o pedido passando por parâmetro na url o número do pedido que será atualizado. (Opcional) URL: http://localhost:3000/order/v10089016vdb 
● Delete o pedido passando por parâmetro na url o número do pedido que será deletado.. (Opcional) URL: http://localhost:3000/order/v10089016vdb 
Armazenar os dados dos pedidos em um banco de dados (Mongodb, SQL ou PostgreSql). 
A API que criará o pedido no banco de dados receberá no body o json abaixo: 
{ 
 "numeroPedido": "v10089015vdb-01", 
 "valorTotal": 10000, 
 "dataCriacao": "2023-07-19T12:24:11.5299601+00:00", 
 "items": [ 
 { 
 "idItem": "2434", 
 "quantidadeItem": 1, 
 "valorItem": 1000 
 } 
 ] 
} 
Exemplo request: 
curl --location 'http://localhost:3000/order' \ 
--header 'Content-Type: application/json' \ 
--data '{ 
"numeroPedido": "v10089015vdb-01", 
"valorTotal": 10000, 
"dataCriacao": "2023-07-19T12:24:11.5299601+00:00", 
"items": [ 
{ 
"idItem": "2434", 
"quantidadeItem": 1, 
"valorItem": 1000 
} 
] 
}' 
Esta API deverá sofrer uma transformação dos dados, ou seja, deverá fazer o mapping dos campos para salvar no banco de dados. O JSON ficará desta forma: 
{ 
 "orderId": "v10089016vdb", 
 "value": 10000, 
 "creationDate": "2023-07-19T12:24:11.529Z", 
 "items": [ 
 { 
 "productId": 2434, 
 "quantity": 1, 
 "price": 1000 
 } 
 ] 
} 

Caso optar pelo banco de dados SQL ou PostgreSql, as tabelas deverão ficar desta forma: 
● Tabela: Order 
○ Coluna: orderId 
○ Coluna: value 
○ Coluna: creationDate 
● Tabela: Items 
○ Coluna: orderId 
○ Coluna: productId 
○ Coluna: quantity 
○ Coluna: price 

Critérios de Avaliação: 
● Funcionalidade completa dos requisitos mínimos. 
● Código bem organizado e comentado. 
● Utilização adequada das convenções de nomenclatura. 
● Tratamento de erros robustos e mensagens de erro compreensíveis. 
● Uso correto das respostas HTTP adequadas para cada operação. 
● Código hospedado em um repositório público no GitHub, com commits organizados e mensagens claras. 
Recursos Adicionais (opcional): 
● Implementar autenticação básica (por exemplo, usando tokens JWT). 
● Documentar a API usando uma ferramenta como Swagger ou Postman. 

from fastapi import HTTPException, status
from utils.thegraph import get_quote
from models.quote import QuoteResponse
from constants.tokens import MATIC_ADDRESS, WMATIC_ADDRESS

class QuoteService:
    def _handle_matic_quote(self, token0Price: str, token1Price: str) -> tuple[float, float]:
        #inverte
        """
        Inverte os preços dos tokens MATIC e WMATIC, retornando os precos
        sempre com a cotação do MATIC como o primeiro.
        Args:
            token0Price: Preço do token de entrada (token_in).
            token1Price: Preço do token de saída (token_out).
        Returns:
            Uma tupla com os preços dos tokens (token0Price, token1Price) após
            a possível inversão.
        """
        return token1Price, token0Price
            
    
    def _handle_matic_token(self, token_in: str, token_out: str) -> tuple[str, str]:
        """
        Verifica se o token MATIC está sendo usado e o substitui por WMATIC.
        Retorna os endereços (potencialmente modificados).

        Args:
            token_in: Endereço do token de entrada.
            token_out: Endereço do token de saída.

        Returns:
            Uma tupla com os endereços dos tokens (token_in, token_out) após a possível substituição.
        """
        if token_in == MATIC_ADDRESS:
            token_in = WMATIC_ADDRESS
        
        if token_out == MATIC_ADDRESS:
            token_out = WMATIC_ADDRESS
        return token_in, token_out

    def get_quote_service(self, token_in: str, token_out: str) -> QuoteResponse:
        """
        Obtém a melhor cotação para um par de tokens, encontrando o pool
        com maior liquidez e volume.

        Args:
            token_in: Endereço do token de entrada.
            token_out: Endereço do token de saída.

        Returns:
            Um objeto QuoteResponse com os detalhes da cotação.

        Raises:
            HTTPException: Se nenhum pool de liquidez for encontrado.
        """
        print(f"Buscando cotação para: {token_in} -> {token_out}")
        
        # Mapeia token MATIC para WMATIC antes de buscar a cotação
        is_matic = token_in == MATIC_ADDRESS or token_out == MATIC_ADDRESS
        if is_matic:
            token_in, token_out = self._handle_matic_token(token_in, token_out)
        
        quote = get_quote(token_in, token_out)

        
        if not quote:
            print(f"Nenhum pool encontrado para o par {token_in}/{token_out}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nenhum pool de liquidez encontrado para o par de tokens fornecido."
            )
        if is_matic:
            # Se for MATIC, inverte os preços
            quote["token0Price"], quote["token1Price"] = self._handle_matic_quote(quote["token0Price"], quote["token1Price"])
        # o token que é passado como token_in deve ser retornado como token0Price
        # por isso vamos ver a partir do id do token retornado e fazer o mapeamento
        if token_in == quote["token1id"]:
            token0_price_temp = float(quote["token0Price"])
            quote["token0Price"] = float(quote["token1Price"])
            quote["token1Price"] = token0_price_temp
        
        response = QuoteResponse(
            pool_id=quote["pool_id"],
            token0Price=quote["token0Price"],
            token1Price=quote["token1Price"],
            fee_tier=int(quote["feeTier"])
        )
        return response


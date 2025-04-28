import { Reflector } from '@nestjs/core';

type TokenTypeEnum = "reset" | "verification"
export const TokenType = Reflector.createDecorator<TokenTypeEnum>();
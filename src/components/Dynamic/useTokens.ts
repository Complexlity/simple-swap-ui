import { useQuery } from "@tanstack/react-query";
import tokenData from "./token.json"

const MOCK_WAIT_TIME_IN_MILLISECONDS = 1000
export function useTokens() {
    return (
        useQuery({
            queryKey: ['tokens'],
            queryFn: async () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                await new Promise((resolve, _) => {
                    setTimeout(() => {
                      resolve("I ended");
                    },MOCK_WAIT_TIME_IN_MILLISECONDS);
                });
                const tokenList = tokenData.tokens
             return tokenList
                
            }       
        })
    )
}
import { useContext } from "react"
import { NodePageContext } from "@vactory/context/Node"

export const useNode = () => {
	return useContext(NodePageContext)
}

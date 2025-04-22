import { Node } from '../types/nodes'

export function shiftAfterNode(previousNode: Node | null, newNode: Node): Node {
	newNode.childAfter = previousNode
	return newNode
}

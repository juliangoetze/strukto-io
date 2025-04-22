export type Node = Statement | WhileDo | DoWhile | IfElse | SwitchCase | MethodBlock

type Case = {
  caseText: string
  caseChild: Node | null
}

export type NodeType = 'statement' | 'while-do' | 'do-while' | 'if-else' | 'switch-case' | 'method-block'

export type NodeBase = {
  type: NodeType | null
  id: string
  childAfter: Node | null
}

export type Statement = NodeBase & {
  type: 'statement'
  textCondition: string
}

export type WhileDo = NodeBase & {
  type: 'while-do'
  textCondition: string
  child: Node | null
}

export type DoWhile = NodeBase & {
  type: 'do-while'
  textCondition: string
  child: Node | null
}

export type IfElse = NodeBase & {
  type: 'if-else'
  textCondition: string
  childIf: Node | null
  childElse: Node | null
}

export type SwitchCase = NodeBase & {
  type: 'switch-case'
  textCondition: string
  cases: Case[]
  elseCase: Case
}

export type MethodBlock = NodeBase & {
  type: 'method-block'
  textCondition: string
}

import { Node, NodeType, IfElse, SwitchCase, DoWhile, WhileDo, Statement, MethodBlock } from '../types/nodes'

export function statementInit(): Statement {
  return {
    type: 'statement',
    id: crypto.randomUUID(),
    childAfter: null,
    textCondition: "Output 'Hello World'",
  }
}

export function methodBlockInit(): MethodBlock {
  return {
    type: 'method-block',
    id: crypto.randomUUID(),
    childAfter: null,
    textCondition: 'Call method helloWorld()',
  }
}

export function doWhileInit(): DoWhile {
  return {
    type: 'do-while',
    id: crypto.randomUUID(),
    child: null,
    childAfter: null,
    textCondition: 'While i > 0',
  }
}

export function whileDoInit(): WhileDo {
  return {
    type: 'while-do',
    id: crypto.randomUUID(),
    child: null,
    childAfter: null,
    textCondition: 'While i > 0',
  }
}

export function ifElseInit(): IfElse {
  return {
    type: 'if-else',
    id: crypto.randomUUID(),
    childIf: null,
    childElse: null,
    childAfter: null,
    textCondition: 'i == 3?',
  }
}

export function switchCaseInit(): SwitchCase {
  return {
    type: 'switch-case',
    id: crypto.randomUUID(),
    childAfter: null,
    textCondition: 'a == ',
    cases: [
      { caseText: '1', caseChild: null },
      { caseText: '2', caseChild: null },
      { caseText: '3', caseChild: null },
    ],
    elseCase: { caseText: 'Else', caseChild: null },
  }
}

export function discriminatedNodeInit(nodeType: NodeType): Node {
  switch (nodeType) {
    case 'if-else':
      return ifElseInit()
    case 'switch-case':
      return switchCaseInit()
    case 'do-while':
      return doWhileInit()
    case 'while-do':
      return whileDoInit()
    case 'method-block':
      return methodBlockInit()
    case 'statement':
      return statementInit()
  }
}

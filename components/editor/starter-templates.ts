import {
  NODE_COLORS,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeShape,
} from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

let templateNodeCounter = 0

// Keeps the template definitions below readable: position/size come straight
// from the shape, only the label/color/coordinates vary per node.
function templateNode(
  id: string,
  shape: CanvasNodeShape,
  colorIndex: number,
  label: string,
  x: number,
  y: number,
  size: { width: number; height: number }
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    width: size.width,
    height: size.height,
    data: { label, color: NODE_COLORS[colorIndex].fill, shape },
  }
}

function templateEdge(id: string, source: string, target: string): CanvasEdge {
  return { id, type: "canvasEdge", source, target, data: {} }
}

const microservicesTemplate: CanvasTemplate = {
  id: "microservices",
  name: "Microservices Architecture",
  description:
    "An API gateway routing to independent services backed by a database and a message queue.",
  nodes: [
    templateNode("gateway", "rectangle", 0, "API Gateway", 260, 20, { width: 160, height: 80 }),
    templateNode("auth", "rectangle", 2, "Auth Service", 40, 200, { width: 160, height: 80 }),
    templateNode("users", "rectangle", 2, "Users Service", 260, 200, { width: 160, height: 80 }),
    templateNode("orders", "rectangle", 2, "Orders Service", 480, 200, { width: 160, height: 80 }),
    templateNode("database", "cylinder", 6, "Database", 260, 380, { width: 120, height: 100 }),
    templateNode("queue", "hexagon", 3, "Message Queue", 480, 380, { width: 160, height: 100 }),
  ],
  edges: [
    templateEdge("gateway-auth", "gateway", "auth"),
    templateEdge("gateway-users", "gateway", "users"),
    templateEdge("gateway-orders", "gateway", "orders"),
    templateEdge("users-database", "users", "database"),
    templateEdge("orders-database", "orders", "database"),
    templateEdge("orders-queue", "orders", "queue"),
  ],
}

const cicdPipelineTemplate: CanvasTemplate = {
  id: "cicd-pipeline",
  name: "CI/CD Pipeline",
  description:
    "A linear build-test-deploy pipeline from source control to production, with a rollback path.",
  nodes: [
    templateNode("repo", "rectangle", 0, "Source Repo", 20, 120, { width: 160, height: 80 }),
    templateNode("build", "rectangle", 1, "Build", 240, 120, { width: 160, height: 80 }),
    templateNode("test", "rectangle", 3, "Test", 460, 120, { width: 160, height: 80 }),
    templateNode("deploy", "rectangle", 6, "Deploy", 680, 120, { width: 160, height: 80 }),
    templateNode("production", "cylinder", 7, "Production", 900, 110, { width: 120, height: 100 }),
    templateNode("rollback", "diamond", 4, "Rollback?", 460, 320, { width: 180, height: 180 }),
  ],
  edges: [
    templateEdge("repo-build", "repo", "build"),
    templateEdge("build-test", "build", "test"),
    templateEdge("test-deploy", "test", "deploy"),
    templateEdge("deploy-production", "deploy", "production"),
    templateEdge("deploy-rollback", "deploy", "rollback"),
    templateEdge("rollback-build", "rollback", "build"),
  ],
}

const eventDrivenTemplate: CanvasTemplate = {
  id: "event-driven-system",
  name: "Event-Driven System",
  description:
    "A producer publishing to an event bus, fanning out to multiple consumers and an event store.",
  nodes: [
    templateNode("producer", "rectangle", 1, "Producer Service", 40, 40, { width: 160, height: 80 }),
    templateNode("bus", "hexagon", 3, "Event Bus", 300, 200, { width: 160, height: 100 }),
    templateNode("store", "cylinder", 6, "Event Store", 560, 40, { width: 120, height: 100 }),
    templateNode("consumer-orders", "rectangle", 2, "Order Consumer", 40, 400, { width: 160, height: 80 }),
    templateNode("consumer-notifications", "rectangle", 2, "Notification Consumer", 300, 400, { width: 160, height: 80 }),
    templateNode("consumer-analytics", "rectangle", 2, "Analytics Consumer", 560, 400, { width: 160, height: 80 }),
  ],
  edges: [
    templateEdge("producer-bus", "producer", "bus"),
    templateEdge("bus-store", "bus", "store"),
    templateEdge("bus-consumer-orders", "bus", "consumer-orders"),
    templateEdge("bus-consumer-notifications", "bus", "consumer-notifications"),
    templateEdge("bus-consumer-analytics", "bus", "consumer-analytics"),
  ],
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  microservicesTemplate,
  cicdPipelineTemplate,
  eventDrivenTemplate,
]

// Returns a deep copy of the template with fresh node/edge ids, so importing
// the same template twice in a session never collides with itself.
export function instantiateTemplate(
  template: CanvasTemplate
): { nodes: CanvasNode[]; edges: CanvasEdge[] } {
  templateNodeCounter += 1
  const runId = `${Date.now()}-${templateNodeCounter}`
  const idMap = new Map(
    template.nodes.map((node) => [node.id, `${template.id}-${node.id}-${runId}`])
  )

  const nodes = template.nodes.map((node) => ({
    ...node,
    id: idMap.get(node.id)!,
    data: { ...node.data },
  }))

  const edges = template.edges.map((edge) => ({
    ...edge,
    id: `${template.id}-${edge.id}-${runId}`,
    source: idMap.get(edge.source)!,
    target: idMap.get(edge.target)!,
    data: { ...edge.data },
  }))

  return { nodes, edges }
}

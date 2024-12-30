import React, { useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  addEdge,
} from "react-flow-renderer";
import { api } from "../api";
import "./FordBellman.css";

function FordBellman() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [source, setSource] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddNode = (node: string) => {
    if (node && !nodes.some((n) => n.id === node)) {
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: node,
          data: { label: node },
          position: { x: 200, y: 200 }, // default position for new nodes
          style: {
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "#fff",
          },
        },
      ]);
    }
  };

  const handleAddEdge = (from: string, to: string, weight: number) => {
    if (from && to && !isNaN(weight)) {
      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: `e${from}-${to}`,
          source: from,
          target: to,
          label: `${weight}`,
          animated: true,
        },
      ]);
    }
  };
  const onNodeDrag = (event: any, node: any) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === node.id
          ? { ...n, position: { x: node.position.x, y: node.position.y } }
          : n
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sommets = edges.reduce((acc, edge) => {
      acc[`${edge.from},${edge.to}`] = edge.weight;
      return acc;
    }, {} as Record<string, number>);

    try {
      setError(null);
      const response = await api.post("/ford-bellman/", {
        noeuds: nodes.map((n) => n.id),
        sommets: sommets,
        la_source: source,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  const onNodeDragStop = (event: any, node: any) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === node.id
          ? { ...n, position: { x: node.position.x, y: node.position.y } }
          : n
      )
    );
  };

  return (
    <div>
      <h1 className="title">Ford-Bellman Algorithm</h1>
      <div className="father-form">
        <form onSubmit={handleSubmit} className="algo-form">
          <div className="nodes-inputs">
            <h3 className="sub-header">Nodes</h3>
            <input
              type="text"
              placeholder="Enter a node (e.g., S)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddNode(e.currentTarget.value.trim());
                  e.currentTarget.value = "";
                }
              }}
              className="nodes-input"
            />
            <p className="para">
              Current Nodes : {nodes.map((node) => node.id).join(", ")}
            </p>
          </div>

          <div>
            <h3 className="sub-header">Edges</h3>
            <div className="inputs-father">
              <input type="text" placeholder="From (e.g., S)" id="from" />
              <input type="text" placeholder="To (e.g., B)" id="to" />
              <input type="number" placeholder="Weight (e.g., 6)" id="weight" />
              <button
                type="button"
                onClick={() => {
                  const from = (
                    document.getElementById("from") as HTMLInputElement
                  ).value.trim();
                  const to = (
                    document.getElementById("to") as HTMLInputElement
                  ).value.trim();
                  const weight = parseFloat(
                    (document.getElementById("weight") as HTMLInputElement)
                      .value
                  );
                  handleAddEdge(from, to, weight);
                  (document.getElementById("from") as HTMLInputElement).value =
                    "";
                  (document.getElementById("to") as HTMLInputElement).value =
                    "";
                  (
                    document.getElementById("weight") as HTMLInputElement
                  ).value = "";
                }}
              >
                Add Edge
              </button>
            </div>
            <ul>
              {edges.map((edge, index) => (
                <li key={index}>
                  {edge.source} → {edge.target} : {edge.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="source-father">
            <label className="sub-header">Source Node:</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., S"
              required
            />
          </div>

          <button type="submit">Run Algorithm</button>
        </form>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3 className="sub-header">Path Lengths</h3>
          <pre className="sub-header">
            {JSON.stringify(result.path_lengths, null, 2)}
          </pre>
          <h3 className="sub-header">Paths</h3>
          <pre className="sub-header">{JSON.stringify(result.paths)}</pre>
        </div>
      )}

      <div style={{ height: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeDragStop={onNodeDragStop}
          onNodeDrag={onNodeDrag}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FordBellman;

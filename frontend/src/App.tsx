import React, { useState } from "react";
import { api } from "./api";

function App() {
  const [nodes, setNodes] = useState<string[]>([]); // For user-entered nodes
  const [edges, setEdges] = useState<
    { from: string; to: string; weight: number }[]
  >([]); // For user-entered edges
  const [source, setSource] = useState<string>(""); // For user-entered source node
  const [result, setResult] = useState<any>(null); // To store the algorithm result
  const [error, setError] = useState<string | null>(null); // To store errors

  const handleAddNode = (node: string) => {
    if (node && !nodes.includes(node)) {
      setNodes([...nodes, node]);
    }
  };

  const handleAddEdge = (from: string, to: string, weight: number) => {
    if (from && to && !isNaN(weight)) {
      setEdges([...edges, { from, to, weight }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert edges to the required format
    const sommets = edges.reduce((acc, edge) => {
      acc[`${edge.from},${edge.to}`] = edge.weight;
      return acc;
    }, {} as Record<string, number>);

    try {
      setError(null);
      const response = await api.post("/ford-bellman/", {
        noeuds: nodes, // Send nodes array
        sommets: sommets, // Send processed edges as sommets
        la_source: source,
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div>
      <h1>Ford-Bellman Algorithm</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Nodes</h3>
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
          />
          <p>Current Nodes: {nodes.join(", ")}</p>
        </div>
        <div>
          <h3>Edges</h3>
          <div>
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
                  (document.getElementById("weight") as HTMLInputElement).value
                );
                handleAddEdge(from, to, weight);
                (document.getElementById("from") as HTMLInputElement).value =
                  "";
                (document.getElementById("to") as HTMLInputElement).value = "";
                (document.getElementById("weight") as HTMLInputElement).value =
                  "";
              }}
            >
              Add Edge
            </button>
          </div>
          <ul>
            {edges.map((edge, index) => (
              <li key={index}>
                {edge.from} → {edge.to} : {edge.weight}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label>Source Node:</label>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h3>Path Lengths</h3>
          <pre>{JSON.stringify(result.path_lengths, null, 2)}</pre>
          <h3>Paths</h3>
          <pre>{JSON.stringify(result.paths, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

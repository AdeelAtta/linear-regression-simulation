import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const [sse, setSSE] = useState(0);
  const canvasRef = useRef(null);

  const dataPoints = [
    { x: 50, y: 50 },
    { x: 100, y: 70 },
    { x: 150, y: 100 },
    { x: 200, y: 150 },
    { x: 250, y: 170 }
  ];

  const calculateBestFit = () => {
    const n = dataPoints.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    dataPoints.forEach(point => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumXX += point.x * point.x;
    });
    const bestSlope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const bestIntercept = (sumY - bestSlope * sumX) / n;
    setSlope(bestSlope);
    setIntercept(bestIntercept);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Draw data points
    dataPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, canvas.height - point.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });

    // Draw regression line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - intercept);
    ctx.lineTo(canvas.width, canvas.height - (slope * canvas.width + intercept));
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // Draw error lines and calculate SSE
    let sumSquaredErrors = 0;
    dataPoints.forEach(point => {
      const predictedY = slope * point.x + intercept;
      const error = point.y - predictedY;
      sumSquaredErrors += error * error;

      ctx.beginPath();
      ctx.moveTo(point.x, canvas.height - point.y);
      ctx.lineTo(point.x, canvas.height - predictedY);
      ctx.strokeStyle = 'green';
      ctx.stroke();
    });

    setSSE(sumSquaredErrors.toFixed(2));
  };

  useEffect(() => {
    drawCanvas();
  }, [slope, intercept]);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Enhanced Interactive Linear Regression</h2>
      <canvas ref={canvasRef} width="300" height="200" className="border border-gray-300 mb-4"></canvas>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="mr-2">Slope (m):</label>
          <button onClick={() => setSlope(s => Math.max(s - 0.1, -2))} className="px-2 py-1 bg-blue-500 text-white rounded">-</button>
          <span className="mx-2">{slope.toFixed(2)}</span>
          <button onClick={() => setSlope(s => Math.min(s + 0.1, 2))} className="px-2 py-1 bg-blue-500 text-white rounded">+</button>
        </div>
        <div>
          <label className="mr-2">Intercept (b):</label>
          <button onClick={() => setIntercept(i => Math.max(i - 10, -100))} className="px-2 py-1 bg-blue-500 text-white rounded">-</button>
          <span className="mx-2">{intercept.toFixed(0)}</span>
          <button onClick={() => setIntercept(i => Math.min(i + 10, 200))} className="px-2 py-1 bg-blue-500 text-white rounded">+</button>
        </div>
      </div>
      <button onClick={calculateBestFit} className="px-4 py-2 bg-green-500 text-white rounded mb-4">Find Best Fit</button>
      <p className="text-lg font-semibold">Sum of Squared Errors: {sse}</p>
    </div>
  );
};

export default App;
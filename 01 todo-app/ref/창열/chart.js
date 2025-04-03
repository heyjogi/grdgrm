export let chart = null;

export function renderChart(todos) {
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const incompleteCount = totalCount - completedCount;

  const data = {
    labels: ["완료", "미완료"],
    datasets: [
      {
        data: [completedCount, incompleteCount],
        backgroundColor: ["#4caf50", "#ddd"],
        borderWidth: 0,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data,
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  };

  if (chart) {
    chart.data = data;
    chart.update();
  } else {
    const ctx = document.getElementById("progressChart").getContext("2d");
    chart = new Chart(ctx, config);
  }

  const progressText = document.getElementById("progressText");
  if (progressText) {
    progressText.textContent =
      totalCount > 0
        ? `진행률: ${Math.round((completedCount / totalCount) * 100)}%`
        : "아직 할 일이 없어요!";
  }
}

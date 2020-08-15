// Global totals endpoint: https://disease.sh/v3/covid-19/all

// Leaflet map
let mymap = L.map("mapid").setView([40.8136, -96.7026], 5);

const ACCESS_TOKEN =
  "pk.eyJ1Ijoid2J1cnI4OSIsImEiOiJja2R0ajJsYXAwZjRvMnZtYzF1MjJoY3V2In0.diIINPcG8MbzApP-WEcJJQ";
// Create map
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 5,
    id: "mapbox/dark-v10",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ACCESS_TOKEN,
  }
).addTo(mymap);

// Demo marker
let marker = L.marker([40.8136, -96.7026]).addTo(mymap);
// Demo pop-up
marker
  .bindPopup(
    "<b>Covid data sourced from John Hopkins University, updated every 10 minutes<br><br>Click anywhere on the map to close"
  )
  .openPopup();
// Closes initial tooltip popup
mymap.on("click", () => {
  mymap.removeLayer(marker);
});
//  END MAP CODE ******

// Event listeners

// User search
let button = document.querySelector(".btn");
button.addEventListener("click", () => {
  let input = document.querySelector("input");
  let searchTerm = input.value;

  if (searchTerm == "") {
    alert("Please enter a search term ");
  } else {
    fetch(`https://disease.sh/v3/covid-19/jhucsse/counties/${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message) {
          alert("County not found, try your search again");
          input.value = "";
        }

        data.forEach((returnedData) => {
          let marker = L.marker([
            `${returnedData.coordinates.latitude}`,
            `${returnedData.coordinates.longitude}`,
          ]).addTo(mymap);
          marker
            .bindPopup(
              `
                State: ${returnedData.province}<br>
                County: ${returnedData.county}<br>
                Confirmed cases: ${returnedData.stats.confirmed}<br>
                Deaths: ${returnedData.stats.deaths}<br>
                Last updated: ${returnedData.updatedAt}
            
            `
            )
            .openPopup();
          mymap.setView(
            [
              `${returnedData.coordinates.latitude}`,
              `${returnedData.coordinates.longitude}`,
            ],
            5
          );

          return returnedData;
        });
      });
  }
});

// Card stats
console.log("CARD STATS------");
fetch("https://disease.sh/v3/covid-19/countries/usa")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // grab main div
    let wrapper = document.querySelector(".card-wrap");
    wrapper.innerHTML = `

    <div class='container header'>
      <h1>U.S Statistics</h1>
      <p class='text-muted'>Hover over the box for more info</p>
      <span class="text-muted"><strong>Last updated:</strong> ${new Date(
        data.updated
      )}</span>
    </div>
    <div class="row container">
    <div class="col-sm-4">
    <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <h3>Total cases</h3>
        <p>${data.cases.toLocaleString("en")}</p>
        <h3>Cases today</h3>
        <p>${data.todayCases.toLocaleString("en")}</p>
      </div>
      <div class="flip-card-back">
        <p><strong>U.S Population: ${data.population.toLocaleString(
          "en"
        )}</strong></p>
        <p><strong>Total active cases:</strong> ${data.active.toLocaleString(
          "en"
        )}</p>
        <p><strong>Active cases per million:</strong> ${data.activePerOneMillion.toLocaleString(
          "en"
        )}</p>
        <p><strong>Total tests taken:</strong> ${data.tests.toLocaleString(
          "en"
        )}</p>
        <p><strong>Total tests per million:</strong> ${data.testsPerOneMillion.toLocaleString(
          "en"
        )}</p>
        <p>There is one case per ${data.oneCasePerPeople} people</p>
      </div>
    </div>
  </div>
    </div>
    <div class="col-sm-4">
    <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <h3>Total Deaths</h3>
        <p>${data.deaths.toLocaleString("en")}</p>
        <h3>Deaths today</h3>
        <p>${data.todayDeaths.toLocaleString("en")}</p>
      </div>
      <div class="flip-card-back">
        <p><strong>Deaths per one million: ${data.deathsPerOneMillion.toLocaleString(
          "en"
        )}
        <p>There is one death per ${data.oneDeathPerPeople.toLocaleString(
          "en"
        )} people</p>
        
      </div>
    </div>
  </div>
    </div>
    <div class="col-sm-4">
    <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <h3>Total recovered</h3>
        <p>${data.recovered.toLocaleString("en")}</p>
        <h3>Recovered today</h3>
        <p>${data.todayRecovered.toLocaleString("en")}</p>
      </div>
      <div class="flip-card-back">
        <p><strong>Recovered per million:</strong> ${data.recoveredPerOneMillion.toLocaleString(
          "en"
        )}</p>
        <p><strong>Total critical cases:</strong> ${data.critical.toLocaleString(
          "en"
        )}</p>
        <p><strong>Critical cases per million:</strong> ${data.criticalPerOneMillion.toLocaleString(
          "en"
        )}</p>
      </div>
    </div>
  </div>
    </div>
  </div>
    `;

    // ChartJS code
    const ctx = document.getElementById("myChart").getContext("2d");

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Total cases",
          "Active cases",
          "Critical cases",
          "Recovered",
          "Tests taken",
        ],
        datasets: [
          {
            label: `United States Covid-19 Data (Current Population: ${data.population.toLocaleString(
              "en"
            )})`,
            data: [
              `${data.cases}`,
              `${data.active}`,
              `${data.critical}`,
              `${data.recovered}`,
              `${data.tests}`,
              3,
            ],
            backgroundColor: [
              "#4F98CF40",
              // "rgba(54, 162, 235, 0.2)",
              // "rgba(255, 206, 86, 0.2)",
              // "rgba(75, 192, 192, 0.2)",
              // "rgba(153, 102, 255, 0.2)",
              // "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "#0368D9",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            toolTip: [],
            borderWidth: 3,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 70000000,
                stepSize: 5000000,
              },
              scaleLabel: {
                display: true,
                labelString: "Population (MILLIONS)",
              },
            },
          ],
        },
      },
    });
  });

fetch("https://disease.sh/v3/covid-19/vaccine")
  .then((response) => response.json())
  .then((data) => console.log(data));

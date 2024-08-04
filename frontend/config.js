const config = {
    local: false, // Set to true for local development, false for production
    getBaseUrl() {
      return this.local ? "http://localhost:7071" : "https://tngapp1.azurewebsites.net";
    },
  };
  
  export default config;
  
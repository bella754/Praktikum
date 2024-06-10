import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("/persons");
  }
}

export default new DataService();
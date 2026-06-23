from locust import HttpUser, task, between

API_KEY = "rk_VCNLm0UB_V5AngGXKjQNG__S286lkS5uyN5cAFk3vfo"

class RateShieldUser(HttpUser):
    wait_time = between(0.1, 0.3)

    @task
    def protected(self):
        self.client.get(
            "/protected",
            headers={
                "x-api-key": API_KEY
            }
        )
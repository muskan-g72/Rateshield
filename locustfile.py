from locust import HttpUser, task, between

API_KEY = "rk_llwb1MY_Iqv_LQ8aAyYyor0Aen6Xsw8s_Za4FMgg54w"


class GatewayUser(HttpUser):

    wait_time = between(0.1, 0.5)

    headers = {
        "X-API-Key": API_KEY
    }

    @task
    def gateway(self):
        self.client.get(
            "/gateway/test",
            headers=self.headers
        )
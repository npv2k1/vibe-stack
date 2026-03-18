import { useMutation } from "@tanstack/react-query";
import { kafkaService } from "./kafka.service";

export const useKafkaPublishMutation = () => {
  return useMutation({
    mutationFn: kafkaService.publish.bind(kafkaService),
    onSuccess: (data) => {
      console.log("Kafka publish success", data);
    },
    onError: (error) => {
      console.error("Kafka publish error", error);
    },
  });
};

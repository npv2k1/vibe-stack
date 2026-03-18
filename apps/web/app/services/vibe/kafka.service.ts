import { BaseService } from "../core/base.service";

export class KafkaService extends BaseService {
  constructor() {
    super("/kafka");
  }

  async publish(request: any) {
    const { queue, content } = request;
    return await this.post("/publish", {
      queue,
      content,
    });
  }
}

export const kafkaService = new KafkaService();

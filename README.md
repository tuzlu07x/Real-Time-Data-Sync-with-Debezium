# Real-Time Data Sync with Debezium: PostgreSQL to MongoDB

This project demonstrates real-time data synchronization between PostgreSQL and MongoDB using Debezium, Apache Kafka, and NestJS. It implements Change Data Capture (CDC) pattern to maintain data consistency across different databases.

## Architecture Overview

![Architecture Diagram](architecture-diagram.png)

The system consists of the following components:

- **PostgreSQL**: Primary database
- **Debezium**: CDC connector for PostgreSQL
- **Apache Kafka**: Message broker for change events
- **NestJS**: Application framework
- **MongoDB**: Target database for synchronization

## Features

- Real-time data synchronization from PostgreSQL to MongoDB
- Change Data Capture (CDC) using Debezium
- Event-driven architecture with Apache Kafka
- RESTful API endpoints for data access
- Automatic handling of Create and Update operations
- Robust error handling and retry mechanisms
- Scalable microservice architecture

## Prerequisites

- Docker and Docker Compose
- Node.js (v14 or higher)
- PostgreSQL
- MongoDB
- Apache Kafka
- Debezium

## Project Structure

```bash
├── src/
│ ├── orders/
│ │ ├── entities/
│ │ │ └── order.entity.ts
│ │ ├── orders.controller.ts
│ │ ├── orders.module.ts
│ │ └── orders.service.ts
│ ├── app.module.ts
│ └── main.ts
├── docker-compose.yml
└── README.md
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Start the infrastructure services:

```bash
docker-compose up -d
```

4. Configure Debezium connector:

```bash
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" \
    http://localhost:8083/connectors/ -d @register-postgres.json
```

5. Start the NestJS application:

```bash
npm run start:dev
```

## Configuration

### PostgreSQL Configuration

```json
{
  "name": "postgres-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "postgres",
    "database.server.name": "dbserver1",
    "table.include.list": "public.orders"
  }
}
```

### Kafka Consumer Configuration

```typescript
{
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['kafka:9093'],
      clientId: 'orders-service',
    },
    consumer: {
      groupId: 'orders-consumer',
      allowAutoTopicCreation: true,
    },
    subscribe: {
      fromBeginning: true,
    },
  },
}
```

## Usage

### API Endpoints

- `GET /orders`: Retrieve all orders
- `GET /orders/:id`: Retrieve a specific order

### Data Synchronization Flow

1. Changes are made to PostgreSQL database
2. Debezium captures changes and sends to Kafka
3. NestJS application consumes Kafka messages
4. Changes are synchronized to MongoDB

### Monitoring

- Check Kafka topics:

```bash
docker exec -it kafka kafka-topics.sh --list --bootstrap-server kafka:9093
```

- Monitor Kafka messages:

```bash
docker exec -it kafka kafka-console-consumer.sh --bootstrap-server kafka:9093 --topic dbserver1.public.orders --from-beginning
```

## Error Handling

The application includes robust error handling:

- Retry mechanism for failed operations
- Detailed logging for debugging
- Graceful handling of connection issues
- Data validation and transformation

## Development

### Adding New Entities

1. Create entity in `src/entities`
2. Update Debezium connector configuration
3. Implement corresponding service and controller
4. Add MongoDB schema

### Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Debezium Documentation](https://debezium.io/documentation/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)

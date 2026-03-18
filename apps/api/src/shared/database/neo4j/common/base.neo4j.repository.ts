import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

import { Neo4jService } from '../neo4j.service';

export class EdgeEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  from: string; // ID of the start node
  @ApiProperty()
  to: string; // ID of the end node
  @ApiProperty()
  type: string; // Relationship type
  // Add more properties as needed
}

@Injectable()
export class BaseNeo4jRepository<T = any> {
  constructor(
    protected readonly neo4jService: Neo4jService,
    protected readonly label: string,
  ) {}

  async create(properties: Partial<T & { id: any }>): Promise<T | null> {
    const session = this.neo4jService.getSession();
    try {
      const result = await session.run(
        `CREATE (n:${this.label} $properties) RETURN n`,
        {
          properties: {
            ...properties,
            id: properties?.id ?? uuidv4(),
          },
        },
      );
      return result.records[0]?.get('n').properties as T;
    } catch (error) {
      console.log('error', error);
      return null;
    } finally {
      await session.close();
    }
  }

  async findAll(): Promise<T[]> {
    const session = this.neo4jService.getSession();
    try {
      const result = await session.run(`MATCH (n:${this.label}) RETURN n`);
      // console.log("finally", result)
      return result.records.map((rec) => {
        const properties = rec.get('n').properties as T;
        return properties;
      });
    } finally {
      await session.close();
    }
  }

  async findById(id: string): Promise<T | null> {
    const session = this.neo4jService.getSession();
    try {
      const result = await session.run(
        `MATCH (n:${this.label} {id: $id}) RETURN n`,
        { id },
      );
      return (result.records[0]?.get('n').properties as T) || null;
    } finally {
      await session.close();
    }
  }

  async update(id: string, update: Partial<T>): Promise<T | null> {
    const session = this.neo4jService.getSession();
    try {
      const result = await session.run(
        `MATCH (n:${this.label} {id: $id}) SET n += $update RETURN n`,
        { id, update },
      );
      return (result.records[0]?.get('n').properties as T) || null;
    } finally {
      await session.close();
    }
  }

  async delete(id: string): Promise<boolean> {
    const session = this.neo4jService.getSession();
    try {
      const result = await session.run(
        `MATCH (n:${this.label} {id: $id}) DETACH DELETE n RETURN COUNT(n) as count`,
        { id },
      );
      return result.records[0]?.get('count').toInt() > 0;
    } finally {
      await session.close();
    }
  }

  // Create an edge (relationship) between two nodes
  async createEdge(edge: Partial<EdgeEntity>): Promise<EdgeEntity | null> {
    const session = this.neo4jService.getSession();
    try {
      const result = await session.run(
        `
        MATCH (a {id: $from}), (b {id: $to})
        CREATE (a)-[r:${edge.type} {id: $id}]->(b)
        RETURN r, a, b
        `,
        {
          id: edge.id,
          from: edge.from,
          to: edge.to,
        },
      );
      const record = result.records[0];
      if (!record) return null;
      return {
        id: record.get('r').properties.id,
        from: record.get('a').properties.id,
        to: record.get('b').properties.id,
        type: edge.type ?? '',
      };
    } finally {
      await session.close();
    }
  }
}

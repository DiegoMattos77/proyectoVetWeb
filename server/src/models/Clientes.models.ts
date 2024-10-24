import { Table, Column, DataType, Model, Default } from 'sequelize-typescript';

@Table({
    tableName: 'clientes',
    timestamps: false
})

class Cliente extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    })
    id_cliente: number;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
        unique: true
    })
    dni: string;

    @Column({
        type: DataType.STRING(13),
        allowNull: false
    })
    cuit_cuil: string;

    @Column({
        type: DataType.STRING(25),
        allowNull: false
    })
    nombre: string;

    @Column({
        type: DataType.STRING(25),
        allowNull: false
    })
    apellido: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    domicilio: string;

    @Column({
        type: DataType.STRING(13),
        allowNull: false
    })
    telefono: string;

    @Column({
        type: DataType.STRING(35),
        allowNull: false
    })
    mail: string;

    @Column({
        type: DataType.STRING(8),
        allowNull: false
    })
    estado: string;

    @Column({
        type: DataType.STRING(16),
        allowNull: true
    })
    password: string;
}

export default Cliente;
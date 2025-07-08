import { Table, Column, DataType, Model, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Cliente from './Clientes.models';

@Table({
    tableName: 'pedidos',
    timestamps: false
})

class pedidos extends Model {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        get() {
            const rawValue = this.getDataValue('id_pedido');
            return rawValue ? rawValue.toString().padStart(7, '0') : null;
        }
    })
    id_pedido: number;

    @ForeignKey(() => Cliente)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_cliente: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 4
    })
    id_empleados: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    fecha_pedido: Date;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    })
    importe: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    anulacion: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    venta_web: number;

    @BelongsTo(() => Cliente)
    cliente: Cliente;

}

export default pedidos;
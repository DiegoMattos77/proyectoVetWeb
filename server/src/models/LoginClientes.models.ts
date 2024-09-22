import { Table, Column, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Cliente from './Clientes.models';

@Table({
    tableName: 'login_clientes',
    timestamps: false
})
class LoginCliente extends Model {
    @ForeignKey(() => Cliente)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_clientes: number;

    @Column({
        type: DataType.STRING(35),
        allowNull: false,
        unique: true
    })
    mail: string;

    @Column({
        type: DataType.STRING(16),
        allowNull: false
    })
    password: string;

    @BelongsTo(() => Cliente)
    cliente: Cliente;
}

export default LoginCliente;
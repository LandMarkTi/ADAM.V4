import { AlteraSenhaModule } from './alterasenha.module';

describe('AlteraSenhaModule', () => {
    let alterasenhaModule: AlteraSenhaModule;

    beforeEach(() => {
        alterasenhaModule = new AlteraSenhaModule();
    });

    it('should create an instance', () => {
        expect(alterasenhaModule).toBeTruthy();
    });
});

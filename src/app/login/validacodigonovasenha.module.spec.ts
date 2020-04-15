import { ValidaCodigoNovaSenhaModule } from './validacodigonovasenha.module';

describe('ValidaCodigoNovaSenhaModule', () => {
    let validacodigonovasenhaModule: ValidaCodigoNovaSenhaModule;

    beforeEach(() => {
        validacodigonovasenhaModule = new ValidaCodigoNovaSenhaModule();
    });

    it('should create an instance', () => {
        expect(validacodigonovasenhaModule).toBeTruthy();
    });
});

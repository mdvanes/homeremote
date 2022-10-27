import { Test, TestingModule } from "@nestjs/testing";
import { MonitController } from "./monit.controller";
import got, { Response, CancelableRequest } from "got";
import { ConfigService } from "@nestjs/config";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { mocked } from "jest-mock";

jest.mock("got");
const mockGot = mocked(got);

const mockAuthenticatedRequest = {
    user: { name: "someuser", id: 1 },
} as AuthenticatedRequest;

const mockXmlResponse = `<monit>
<server>
<id>1</id>
<incarnation>1</incarnation>
<version>1</version>
<uptime>123</uptime>
<poll>1</poll>
<startdelay>1</startdelay>
<localhostname>some-localhostname</localhostname>
<controlfile>1</controlfile>
<httpd>
<address>1</address>
<port>1</port>
<ssl>1</ssl>
</httpd>
</server>
<platform>
<name>1</name>
<release>1</release>
<version>1</version>
<machine>1</machine>
<cpu>1</cpu>
<memory>1</memory>
<swap>1</swap>
</platform>
<service type="3">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<pid>1</pid>
<ppid>1</ppid>
<uid>1</uid>
<euid>1</euid>
<gid>1</gid>
<uptime>1</uptime>
<threads>1</threads>
<children>1</children>
<memory>
<percent>1</percent>
<percenttotal>1</percenttotal>
<kilobyte>1</kilobyte>
<kilobytetotal>1</kilobytetotal>
</memory>
<cpu>
<percent>1</percent>
<percenttotal>1</percenttotal>
</cpu>
<read>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
</read>
<write>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
</write>
<port>
<hostname>1</hostname>
<portnumber>1</portnumber>
<request>1</request>
<protocol>1</protocol>
<type>1</type>
<responsetime>1</responsetime>
</port>
</service>
<service type="0">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<fstype>1</fstype>
<fsflags>1</fsflags>
<mode>1</mode>
<uid>1</uid>
<gid>1</gid>
<block>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</block>
<inode>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</inode>
<read>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</read>
<write>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</write>
<servicetime>
<read>1</read>
<write>1</write>
</servicetime>
</service>
<service type="0">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<fstype>1</fstype>
<fsflags>1</fsflags>
<mode>1</mode>
<uid>1</uid>
<gid>1</gid>
<block>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</block>
<inode>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</inode>
<read>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</read>
<write>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</write>
<servicetime>
<read>1</read>
<write>1</write>
</servicetime>
</service>
<service type="0">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<fstype>1</fstype>
<fsflags>1</fsflags>
<mode>1</mode>
<uid>1</uid>
<gid>1</gid>
<block>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</block>
<inode>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</inode>
<read>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</read>
<write>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</write>
<servicetime>
<read>1</read>
<write>1</write>
</servicetime>
</service>
<service type="0">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<fstype>1</fstype>
<fsflags>1</fsflags>
<mode>1</mode>
<uid>1</uid>
<gid>1</gid>
<block>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</block>
<inode>
<percent>1</percent>
<usage>1</usage>
<total>1</total>
</inode>
<read>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</read>
<write>
<bytes>
<count>1</count>
<total>1</total>
</bytes>
<operations>
<count>1</count>
<total>1</total>
</operations>
</write>
<servicetime>
<read>1</read>
<write>1</write>
</servicetime>
</service>
<service type="7">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<program>
<started>1</started>
<status>1</status>
<output>1</output>
</program>
</service>
<service type="7">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<program>
<started>1</started>
<status>1</status>
<output>1</output>
</program>
</service>
<service type="7">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<program>
<started>1</started>
<status>1</status>
<output>1</output>
</program>
</service>
<service type="7">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<program>
<started>1</started>
<status>1</status>
<output>1</output>
</program>
</service>
<service type="4">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<port>
<hostname>1</hostname>
<portnumber>1</portnumber>
<request>1</request>
<protocol>1</protocol>
<type>1</type>
<responsetime>1</responsetime>
</port>
</service>
<service type="4">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<port>
<hostname>1</hostname>
<portnumber>1</portnumber>
<request>1</request>
<protocol>1</protocol>
<type>1</type>
<responsetime>1</responsetime>
</port>
</service>
<service type="4">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<port>
<hostname>1</hostname>
<portnumber>1</portnumber>
<request>1</request>
<protocol>1</protocol>
<type>1</type>
<responsetime>1</responsetime>
</port>
</service>
<service type="4">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<port>
<hostname>1</hostname>
<portnumber>1</portnumber>
<request>1</request>
<protocol>1</protocol>
<type>1</type>
<responsetime>1</responsetime>
</port>
</service>
<service type="4">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<port>
<hostname>1</hostname>
<portnumber>1</portnumber>
<request>1</request>
<protocol>1</protocol>
<type>1</type>
<responsetime>1</responsetime>
</port>
</service>
<service type="4">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<every>
<type>1</type>
<counter>1</counter>
<number>1</number>
</every>
<port>
<hostname>1</hostname>
<portnumber>1</portnumber>
<request>1</request>
<protocol>1</protocol>
<type>1</type>
<responsetime>1</responsetime>
</port>
</service>
<service type="5">
<name>1</name>
<collected_sec>1</collected_sec>
<collected_usec>1</collected_usec>
<status>1</status>
<status_hint>1</status_hint>
<monitor>1</monitor>
<monitormode>1</monitormode>
<onreboot>1</onreboot>
<pendingaction>1</pendingaction>
<system>
<load>
<avg01>1</avg01>
<avg05>1</avg05>
<avg15>1</avg15>
</load>
<cpu>
<user>1</user>
<system>1</system>
<wait>1</wait>
</cpu>
<memory>
<percent>1</percent>
<kilobyte>1</kilobyte>
</memory>
<swap>
<percent>1</percent>
<kilobyte>1</kilobyte>
</swap>
</system>
</service>
</monit>`;

describe("MonitController", () => {
    let controller: MonitController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MonitController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<MonitController>(MonitController);

        jest.spyOn(configService, "get").mockReturnValue("a,b,c;d,e,f");
    });

    it("returns localhostnames with servicenames", async () => {
        mockGot.mockReturnValue({
            text: () => Promise.resolve(mockXmlResponse),
        } as CancelableRequest<Response>);
        const result = await controller.getMonit(mockAuthenticatedRequest);
        expect(mockGot).toBeCalledTimes(2);
        expect(mockGot).toBeCalledWith("c", { password: "b", username: "a" });
        expect(mockGot).toBeCalledWith("f", { password: "e", username: "d" });
        expect(result).toEqual({
            monitlist: [
                {
                    localhostname: "some-localhostname",
                    uptime: 123,
                    serviceNames: expect.arrayContaining([1]),
                },
                {
                    localhostname: "some-localhostname",
                    uptime: 123,
                    serviceNames: expect.arrayContaining([1]),
                },
            ],
        });
    });
});

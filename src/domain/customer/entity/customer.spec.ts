import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2.handler";
import AddressChangedEvent from "../event/address-changed.event";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrow("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.changeAddress(address);

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error activate customer when address is undefined", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrow("Address is mandatory to activate customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should notify event handlers when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    const customer = new Customer("1", "Customer 1");

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify event handlers when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("AddressChangedEvent", eventHandler);

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");

    customer.changeAddress(address);

    const addressChangedEvent = new AddressChangedEvent({
      clientId: customer.id,
      clientName: customer.name,
      address: address.toString()
    });
    
    eventDispatcher.notify(addressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});